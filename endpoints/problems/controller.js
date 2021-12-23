const AppError = require('../../tools/appError');
const { bodyFilter } = require('../../tools/bodyFilter');
const { responseWrapper } = require('../../tools/factories');
const catchAsync = require('./../../tools/catchAsync');
const Problem = require('./model');
const Solution = require('./../solutions/model');
const mongoose = require('mongoose');
const Lang = require('./../code-lang/model');
const Comment = require('../comments/model');
const {User} = require('./../users/model');
const { promisify } = require('util');
const jwt = require("jsonwebtoken");

const newTimeLimit = 24*60*60*1000; // 24h

module.exports.getAllProblems = catchAsync(async(req, res, next)=>{

    const problems = await Problem.find({});

    if (!problems){ return next(new AppError("unknown error",500));}
    
    return responseWrapper(res, 200, problems);
});

module.exports.getProblemsByLanguageId = catchAsync(async (req, res, next)=>{

    const {id} = req.params;
    const {isnew,search,favorites} = req.query;
    const favs = favorites==='true';

    let token = null;
    let payload = null;

    if(favs){
        token = req.headers.authorization.split(' ')[1] || 'null' ;
        payload = await promisify(jwt.verify)(token,process.env.JWT_KEY);
    }
    console.log(payload);


    const pageIndex =  req.query.page  * 1 || 0 ;
    const recordsPerPage = req.query.limit * 1 || 10 ;
    const recordsToSkip = pageIndex * recordsPerPage;

    
    if (!id) return next(new AppError("bad request: a language is is required",400));
    
    const totalDocuments = await Problem.find({language:id}).countDocuments();

    if(!!req.query.page && recordsToSkip >= totalDocuments){
        return next(new AppError('the requested resource was not found',404));         
    }

    console.log(favs? "favs: Users":"not FAvs: Problems")

    const problems = favs? 
            await User.aggregate([{
                        $match:{ _id: mongoose.Types.ObjectId(payload.id) }
                    },{
                        $lookup:{
                            from:"problems",
                            localField:"favProblems",
                            foreignField:"_id",
                            as: "favProblems"

                        }
                    },{
                        $unwind: "$favProblems"
                    },{
                        $replaceRoot:{ newRoot: "$favProblems" }
                    },{
                        $addFields:{
                            is_New: {$lte:[{$subtract:[new Date(), "$date" ]},newTimeLimit]}
                        }
                    }]).sort('title').skip(recordsToSkip).limit(recordsPerPage)

        :
            await Problem.aggregate([// allows to query over a dynamic value
                {
                    $match:{ $expr: { $and: [
                        {$eq:["$language",mongoose.Types.ObjectId(id)]},   // matches by id
                        {$cond:[!!search,{$regexMatch: { input: "$title", regex: new RegExp(search,'i')   } },true ]},
                        {$lte:[{$cond:[
                            isnew==="true",{$subtract:[new Date(Date.now()), "$date" ]},0
                        ]},newTimeLimit]}

                        ] }}, // if isnew:true returns all new (less than 24h) problems
                },{
                    $addFields:{
                        is_New: {$lte:[{$subtract:[new Date(Date.now()), "$date" ]},newTimeLimit]}
                    }
                },{
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author"
                    }
                },{
                    $unwind : "$author"
                } ,{
                    $project:{
                        _id:1,
                        language:1,
                        date:1,   
                        title:1,
                        description:1,
                        author: { _id:1 ,  username: 1},
                        is_New:1
                    }
                }
            
            ]).sort('title').skip(recordsToSkip).limit(recordsPerPage);

    //todo implement favorite query after users endpoint implemented use ternary for isfavorite
    return responseWrapper(res,200,problems,'',{
        total: totalDocuments,
        skipped: recordsToSkip,
        pageSent: pageIndex,
        limitPerPage: recordsPerPage
    });
});

module.exports.postProblemByLanguageId = catchAsync(async(req, res, next)=>{
    
    const language = req.params.id;
    const {title, description, solution, comments} = req.body;
    const {_id} = req.user;

    if(!language || !title || !description || !_id) return next(new AppError("invalid or missing data, check your input",400));

    const session = await Solution.startSession();

    session.startTransaction();
    try{ // this block is for transaction operational errors
        const  options = { session };
        
        const activeLanguage  = await Lang.find({_id: language});
        
        if(!activeLanguage[0]){
            throw new AppError('incorrect data, please verify your input: not such language',400);
        }

        const newProblem = await Problem.create([{
            title:title,
            language: language,
            description: description,
            author:_id
        }],options);

                
        const newSolution = await Solution.create([{ problemId: newProblem[0]._id, solution: solution, postedBy:_id}],options);
        
        if(!!comments && comments !== ""){
            const newComment = await Comment.create([{author:_id, source: newSolution[0]._id, text:comments}]);
        }

        await session.commitTransaction();
        session.endSession();
        
        return responseWrapper(res,201,newProblem);

    }catch(er){
        await session.abortTransaction();
        session.endSession();

        throw er;        
    }

});

module.exports.patchProblemById = catchAsync(async(req, res, next)=>{

    const {id} = req.params;
    const {_id: author} = req.user;

    const updatedProblem = await Problem.findOneAndUpdate({_id: id, author},bodyFilter(req, "title", "description"),{new: true, runValidators: true});

    // todo limit the updating up to 30 min after created the problem.

    if(!updatedProblem){
        return next(new AppError("the requested problem does not exist or can not be updated",404));
    }
    
    return responseWrapper(res,200,updatedProblem);
});

module.exports.deleteProblemById = catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const {_id: author} = req.user;


    const deleted = await Problem.findOneAndDelete({_id:id, author});

    if(!deleted){
        return next(new AppError("the requested document can not be found",400));
    }else{
        return responseWrapper(res,204,{data:"deleted"});
    }
});

