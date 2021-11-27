const {validatorConstructor} = require('./../tools/factories');
const objectId = require("mongoose").Types.ObjectId;
const ValidationError = require('./validationError');

module.exports.minValidator = (field,amount)=>{
    return validatorConstructor(field,{min:amount});
};

module.exports.maxValidator = (field,amount)=>{
    return validatorConstructor(field,{max:amount});
};

module.exports.minlengthValidator = (field,amount)=>{
    return validatorConstructor(field,{minlength: amount});
};

module.exports.maxlengthValidator = (field,amount)=>{
    return validatorConstructor(field,{maxlength: amount});
};

module.exports.alphanumValidator = (field)=>{
    return validatorConstructor(field,{alpha:true});
};
module.exports.emailValidator = (field)=>{
    return validatorConstructor(field,{email:true});
};

module.exports.objectIdValidator = (field)=>{
    if (!objectId.isValid(field)){
        return new ValidationError(new Error(`validation failed /${field}/ is not a valid mongo ObjectId `),"validation");
    }
};