const AppError = require('../../tools/appError');
const { bodyFilter } = require('../../tools/bodyFilter');
const { responseWrapper } = require('../../tools/factories');
const catchAsync = require('./../../tools/catchAsync');
const Problem = require('./model');

module.exports.getAllProblems = catchAsync(async(req, res, next)=>{

    const problems = await Problem.find({});

    if (!problems){ return next(new AppError("unknown error",500));}
    
    return responseWrapper(res, 200, problems);
});

module.exports.getProblemsByLanguageId = catchAsync(async (req, res, next)=>{

    const {id} = req.params;
    
    if (!id) return next(new AppError("bad request: a language is is required",400));

    const problems = await Problem.find({language: id});

    return responseWrapper(res,200,problems);
});

module.exports.postProblemByLanguageId = catchAsync(async(req, res, next)=>{
    
    const language = req.params.id;
    const {title, description} = req.body;

    if(!language || !title || !description) return next(new AppError("bad request: missing required fields",400));

    const newProblem = await Problem.create({
        title:title,
        language: language,
        description: description
        //todo add here the author field once created the author endpoint.
    });

    if (!newProblem){
        return next(new AppError("bad request: invalid data",400));
    }
    return responseWrapper(res,201,newProblem);

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

