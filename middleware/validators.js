const ValidationError = require('./../tools/validationError');
const { objectIdValidator, minlengthValidator, maxlengthValidator } = require('./../tools/validatorCases');


module.exports.validObjectIdParamValidator = async(req, res, next)=>{
    return next(objectIdValidator(req.params.id));
};

module.exports.commentBodyValidator = async(req, res, next)=>{
    try{
        minlengthValidator(req.body.text,1);
        maxlengthValidator(req.body.text,2500);
        next();
    }catch(error){
        next(error);
    }
    
};
