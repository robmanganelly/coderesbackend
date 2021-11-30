const AppError = require('../../tools/appError');
const { responseWrapper } = require('../../tools/factories');
const catchAsync = require('./../../tools/catchAsync');
const Solutions = require('./model');

module.exports.getAllSolutions = catchAsync(async(req, res, next)=>{

    const allSolutions = await Solutions.find({});

    if (!allSolutions){
        return next(new AppError("unknown internal error",500));
    }

    return responseWrapper(res, 200,allSolutions);
});

module.exports.postSolution = catchAsync(async(req, res, next)=>{
    //todo
});

module.exports.getSolutionsById = catchAsync(async(req, res, next)=>{
    const {id} = req.params;

    const allSolutions = await Solutions.findById(id);
    if (!allSolutions){
        return next(new AppError("unknown internal error",500));
    }

});

module.exports.patchSolution = catchAsync(async(req, res, next)=>{
    //todo
});


module.exports.deleteSolution = catchAsync(async(req, res, next)=>{
    //todo
});