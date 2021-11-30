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
    const {text} = req.body;

    const existentProblem = await Problem.findById(problemId);

    if (!existentProblem){ return next(new AppError("the requested resource was not found on this server",404));}

    const newSolution = await Solution.create({problemId, text});

    return responseWrapper(res, 201,newSolution);

});

module.exports.getSolutionsById = catchAsync(async(req, res, next)=>{
    const {id} = req.params;

    const allSolutions = await Solution.find({problemId: id});
    if (!allSolutions){
        return next(new AppError("the requested solutions does not exist on this server",404));
    }

    return responseWrapper(res, 200, allSolutions);

});

module.exports.patchSolution = catchAsync(async(req, res, next)=>{
    // requires only solution id

    const {id} = req.params;
    const {text} = req.body;

    if (!id || !text){
        return next(new AppError("bad request: invalid or missing data",400));
    }

    const updatedSolution = await Solution.findByIdAndUpdate(id,{text},{new: true});

    return responseWrapper(res,201,updatedSolution);

});


module.exports.deleteSolution = catchAsync(async(req, res, next)=>{
    
    const {id} = req.params;
    // todo add later user permissions (only posts owners and admins can delete posts)

    const deleted = await Solution.findByIdAndDelete(id);

    if(!!deleted){return responseWrapper(res, 204,"no data");}

});

