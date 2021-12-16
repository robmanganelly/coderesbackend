const Comment = require('./model');
const catchAsync = require('./../../tools/catchAsync');
const {responseWrapper} = require('./../../tools/factories');
const AppError = require('./../../tools/appError');

module.exports.getComments = catchAsync(async (req, res, next)=>{
    // todo protect this endpoint allow only admin accessing (further processing)
    const comments = await Comment.find({});

    return responseWrapper(res,200,comments,"all comments sent");
    
});

module.exports.createCommentBySolutionId = catchAsync(async (req, res, next)=>{
    // todo enhance after adding users endpoint, comments require a user data field 
    const {id} = req.params;
    const {text} = req.body;
    
    if(!id || !text){ return next(new AppError(`bad request: missing required data <${!id? "solution": "text"}>`,400));}

    const newComment = await Comment.create({source: id, text});
    
    return responseWrapper(res,201,newComment,'comment added successfully');
});

module.exports.deleteCommentById = catchAsync(async (req, res, next)=>{
    const {id} = req.params;

    if(!id){
        return next(new AppError("the requested comment was not found on this server",404));
    }

    const deleted = await Comment.findByIdAndDelete(id);

    return responseWrapper(res,204,"no data","comment deleted successfully");
});

module.exports.patchCommentById = catchAsync(async (req, res, next)=>{
    const {id} = req.params;
    const {text} = req.body;

    if(!id || !text){
        return next(new AppError("bad request, missing data to update",400));
    }

    const commentToUpdate = await Comment.findByIdAndUpdate(id,{text},{new:true});

    if (!commentToUpdate){ return next(new AppError("The requested comment has not been found on this server",404))};

    return responseWrapper(res,200,commentToUpdate);

});

module.exports.getCommentsBySolutionId = catchAsync(async (req, res, next)=>{
    const {id} = req.params;

    if (!id){ return next(new AppError("missing required data: solution  ",400)); }

    const comments = await Comment.find({source: id});

    return responseWrapper(res,200,comments,"all comments sent");

});