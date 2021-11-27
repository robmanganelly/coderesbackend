const Lang = require('./model');
const {responseEnveloper} = require('./../../tools/factories');
const catchAsync = require('../../tools/catchAsync');
const AppError = require('./../../tools/appError');

module.exports.getLanguages = catchAsync(async(req, res, next)=>{
    const allLang = await Lang.find();
    
    return responseEnveloper(res,200,allLang);
})

module.exports.addLanguage  = catchAsync(async(req, res, next)=>{
    
    const {name, img} = req.body;

    if(!name || !img){
        return new AppError("bad request: wrong input", 400);
    }
    const lang = await Lang.create({ name, img });
    // if (!lang) return new AppError('bad request', 400);
    
    return responseEnveloper(res,201,"language added successfully");
});

module.exports.deleteLanguage = catchAsync(async (req, res, next)=>{
    const {id} = req.body;

    if (!id  || typeof id !== "string"){
        return next(new AppError("bad request: wrong input ",400));
    }

    const deleted = await Lang.findByIdAndDelete(id);
    
    if(!deleted){ return next(new AppError("the requested resource has not been found",404))}
    
    return responseEnveloper(res,204,"no data","successfully deleted");
});