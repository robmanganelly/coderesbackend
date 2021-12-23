const AppError = require('../../tools/appError');
const { responseWrapper } = require('../../tools/factories');
const catchAsync = require('./../../tools/catchAsync');
const Solution = require('./model');
const Problem = require('./../problems/model');

module.exports.getAllSolutions = catchAsync(async(req, res, next)=>{

    const allSolutions = await Solution.find({});

    if (!allSolutions){
        return next(new AppError("unknown internal error",500));
    }

    return responseWrapper(res, 200,allSolutions);
});

module.exports.postSolution = catchAsync(async(req, res, next)=>{
    
    const problemId = req.params.id;
    const {solution} = req.body;
    const {_id} = req.user; // the auth guard provides the user.
        
    if(!problemId || !solution || !_id) return next(new AppError("invalid or missing data, can not create solution",400));

    const existentProblem = await Problem.findById(problemId);

    if (!existentProblem){ return next(new AppError("the requested resource was not found on this server",404));}

    const existentSolution = await Solution.findOne({problemId, postedBy: _id});
    if(existentSolution){
        return next(new AppError('can not post duplicate solutions',400));
    }

    const newSolution = await Solution.create({problemId, solution, postedBy: _id});

    return responseWrapper(res, 201,newSolution);

});

module.exports.getSolutionsById = catchAsync(async(req, res, next)=>{
    const {id} = req.params;

    const allSolutions = await Solution.find({problemId: id}).populate({path: 'postedBy', select: 'username'});
    if (!allSolutions){
        return next(new AppError("the requested solutions does not exist on this server",404));
    }

    return responseWrapper(res, 200, allSolutions);

});

module.exports.patchSolution = catchAsync(async(req, res, next)=>{

    const {id} = req.params;
    const {solution} = req.body;
    const {_id} = req.user;

    if (!id || !solution || !_id){
        return next(new AppError("bad request: invalid or missing data",400));
    }

    const updatedSolution = await Solution.findOneAndUpdate({_id:id, postedBy:_id},{solution},{new: true});
    if(!updatedSolution){ return next(new AppError('can not update the requested resource, check your input',400));}

    return responseWrapper(res,201,updatedSolution);

});


module.exports.deleteSolution = catchAsync(async(req, res, next)=>{
    
    const {id} = req.params;
    const {_id } = req.user;

    // todo add later user permissions (only posts owners and admins can delete posts)

    const deleted = await Solution.findOneAndDelete({_id:id, postedBy:_id});

    if(!deleted){return next(new AppError('can not delete the requested resource',404)); }
    return responseWrapper(res, 204,"no data");

});

