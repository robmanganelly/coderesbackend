const Comment = require('./model');
const catchAsync = require('./../../tools/catchAsync');
const {responseEnveloper} = require('./../../tools/factories');
const AppError = require('./../../tools/appError');

module.exports.getComments = catchAsync(async (req, res, next)=>{
    // todo protect this endpoint allow only admin accessing (further processing)
    const comments = await Comment.find({});

    return responseEnveloper(res,200,comments,"all comments sent");
    
});

module.exports.createComment = catchAsync(async (req, res, next)=>{
    // todo enhance after adding users endpoint, comments require a user data field 
    const {text} = req.body;

    if(!text){ return next(new AppError("bad request: some text required",400))}

    const newComment = await Comment.create({text});
    
    return responseEnveloper(res,201,newComment,'comment added successfully');
});

module.exports.deleteCommentById = catchAsync(async (req, res, next)=>{
    const {id} = req.params;

    if(!id){
        return next(new AppError("the requested comment was not found on this server",404));
    }

    const deleted = await Comment.findByIdAndDelete(id);

    return responseEnveloper(res,204,"no data","comment deleted successfully");
});