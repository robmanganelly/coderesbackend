const AppError = require('../../tools/appError');
const { bodyFilter } = require('../../tools/bodyFilter');
const { responseWrapper } = require('../../tools/factories');
const catchAsync = require('./../../tools/catchAsync');
const Problem = require('./model');
const Solution = require('./../solutions/model');
const mongoose = require('mongoose');
const Lang = require('./../code-lang/model');

const newTimeLimit = 24*60*60*1000; // 24h

module.exports.getAllProblems = catchAsync(async(req, res, next)=>{

    const problems = await Problem.find({});

    if (!problems){ return next(new AppError("unknown error",500));}
    
    return responseWrapper(res, 200, problems);
});

module.exports.getProblemsByLanguageId = catchAsync(async (req, res, next)=>{

    const {id} = req.params;
    const {isnew,search} = req.query;

    const pageIndex =  req.query.page  * 1 || 0 ;
    const recordsPerPage = req.query.limit * 1 || 10 ;
    const recordsToSkip = pageIndex * recordsPerPage;

    console.log(req.query); 
    
    if (!id) return next(new AppError("bad request: a language is is required",400));
    
    const totalDocuments = await Problem.find({language:id}).countDocuments();

    if(!!req.query.page && recordsToSkip >= totalDocuments){
        return next(new AppError('the requested resource was not found',404));         
    }

    const problems =  await Problem.aggregate([{ // allows to query over a dynamic value
        $match:{ $expr: { $and: [
            {$eq:["$language",mongoose.Types.ObjectId(id)]},   // matches by id
            {$cond:[!!search,{$regexMatch: { input: "$title", regex: new RegExp(search)   } },true ]},
            {$lte:[{$cond:[
                isnew==="true",{$subtract:[new Date(Date.now()), "$date" ]},0
            ]},newTimeLimit]}

        ] }} // if isnew:true returns all new (less than 24h) problems
    },{
        $addFields:{
            is_New: {$lte:[{$subtract:[new Date(Date.now()), "$date" ]},newTimeLimit]}
        }
    }
    
    ]).sort('title').skip(recordsToSkip).limit(recordsPerPage);

    //todo implement favorite query after users endpoint implemented use ternary for isfavorite
    console.log(problems.length);
    return responseWrapper(res,200,problems,'',{
        total: totalDocuments,
        skipped: recordsToSkip,
        pageSent: pageIndex,
        limitPerPage: recordsPerPage

    });
});

module.exports.postProblemByLanguageId = catchAsync(async(req, res, next)=>{
    
    const language = req.params.id;
    const {title, description, solution} = req.body;

    if(!language || !title || !description) return next(new AppError("bad request: missing required fields",400));

    const session = await Solution.startSession();

    session.startTransaction();
    try{ // this block is for transaction operational errors
        const  options = { session };
        
        const activeLanguage  = await Lang.find({_id: language});
        
        console.log(activeLanguage);
        if(!activeLanguage[0]){
            throw new AppError('incorrect data, please verify your input: not such language',400);
        }

        const newProblem = await Problem.create([{
            title:title,
            language: language,
            description: description
            //todo add here the author field once created the author endpoint.
        }],options);

                
        const newSolution = await Solution.create([{ problemId: newProblem[0]._id, solution: solution}],options);

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

    const updatedProblem = await Problem.findByIdAndUpdate(id,bodyFilter(req, "title", "description"),{new: true, runValidators: true});

    // todo limit the updating up to 30 min after created the problem.

    if(!updatedProblem){
        return next(new AppError("the requested problem does not exist or can not be updated",404));
    }
    
    return responseWrapper(res,200,updatedProblem);
});

module.exports.deleteProblemById = catchAsync(async(req, res, next)=>{
    const {id} = req.params;

    const deleted = await Problem.findByIdAndDelete(id);

    if(!deleted){
        return next(new AppError("the requested document can not be found",400));
    }else{
        return responseWrapper(res,204,{data:"deleted"});
    }
});

