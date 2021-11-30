const ValidationError = require('./../tools/validationError');
const { objectIdValidator, minlengthValidator, maxlengthValidator } = require('./../tools/validatorCases');


module.exports.validObjectIdParamValidator = async(req, res, next)=>{
    return next(objectIdValidator(req.params.id));
};

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

module.exports.commentBodyValidator = async(req, res, next)=>{
    try{
        minlengthValidator(req.body.text,1);
        maxlengthValidator(req.body.text,2500);
        next();
    }catch(error){
        next(error);
    }
    
};

module.exports.problemBodyValidator = async (req, res, next)=>{
    try{
        minlengthValidator(req.body.title,10);
        maxlengthValidator(req.body.title,300);
        maxlengthValidator(req.body.description,500);


        next();
    }catch(error){

        next(error);
    }
};

module.exports.deferredProblemBodyValidator = async (req, res, next)=>{
    try{
        if(typeof(req.body.title) !== "undefined") {
            minlengthValidator(req.body.title,10);
            maxlengthValidator(req.body.title,300);
        }
        if(typeof(req.body.description) !== "undefined") maxlengthValidator(req.body.description,500);


        next();
    }catch(error){

        next(error);
    }
};
