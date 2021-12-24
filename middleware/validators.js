const catchAsync = require('../tools/catchAsync');
const ValidationError = require('./../tools/validationError');
const { objectIdValidator, minlengthValidator, maxlengthValidator } = require('./../tools/validatorCases');


module.exports.validObjectIdParamValidator = catchAsync(async(req, res, next)=>{
    
        (objectIdValidator(req.params.id));
        next();
    
});

module.exports.multipleIdParamsValidators = (...names)=>{
    return async function(req, res, next){
        try{
            for (let name of names){
                objectIdValidator(req.params[name]);
            }
            next();
        }   catch(error){
            next(error);
        }
    };
};

module.exports.commentBodyValidator = catchAsync(async(req, res, next)=>{
    
    minlengthValidator(req.body.text,1);
    maxlengthValidator(req.body.text,2500);
    next();
});

module.exports.problemBodyValidator = catchAsync(async (req, res, next)=>{
    minlengthValidator(req.body.title,10);
    maxlengthValidator(req.body.title,300);
    maxlengthValidator(req.body.description,500);
    next();

});

module.exports.deferredProblemBodyValidator = catchAsync(async (req, res, next)=>{
    if(typeof(req.body.title) !== "undefined") {
        minlengthValidator(req.body.title,10);
        maxlengthValidator(req.body.title,300);
        next();
    }
    if(typeof(req.body.description) !== "undefined") maxlengthValidator(req.body.description,500);
    next();
});

module.exports.solutionBodyValidator = catchAsync(async(req, res, next)=>{
    if(!req.body.solution){return next();}
    minlengthValidator(req.body.solution,5);
    maxlengthValidator(req.body.solution,3500);
    next();
});