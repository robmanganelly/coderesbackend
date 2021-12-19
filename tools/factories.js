const AppError = require("./appError");
const ValidationError = require("./validationError");

module.exports.responseWrapper = function(res, code, rawData,msg = "",meta=null){
    
    if (msg === ""){
        switch (true) {
            case (100<= code && code <=199):
                msg=`this is an info response, code: ${code}`;
                break;
            case (200<= code && code <=299):
                msg=`this is a success response, code: ${code}`;
                break;
            case (300<= code && code <=399):
                msg=`you will be redirected, code: ${code}`;
                break;
            case (400<= code && code <=499):
                msg=`this is a error response, code: ${code}`;
                break;
            default: 
                msg=`unknown internal error, code: ${code}`;
                break;
        }
    }


    let enveloped = {
        status: 299 >= code && code >= 200 ? "success": "error",
        data:{ data: rawData},
        message: msg,
        code
    };

    if(!!meta){
        enveloped.meta = meta;
    }else{
        enveloped.meta = {};
    }

    if (Array.isArray(rawData)){
        enveloped.meta.count = rawData.length;
    }

    return res.status(code).json(enveloped);
};



function expectedType(option,expected){
    if(typeof option !== expected){
        throw new AppError("wrong option type in validation",500);
    }else{
        return true;
    }
}

module.exports.validatorConstructor = function(field,options){
    if(typeof field === "undefined"){
        throw new AppError('validation failed: invalid data',400);
    }
    else if (!["string","number"].includes(typeof field)){
        throw new AppError(`wrong type on validator constructor: unsupported type ${field}`,500) // todo review this after production.
    }
    else if(typeof(field) === "string"){
        if(!!options.minlength && expectedType(options.minlength,"number") && field.length < options.minlength){
            throw new ValidationError(new Error(`validation failed: minimum length must be ${options.minlength}`),"validation");
        }
        if(!!options.maxlength && expectedType(options.maxlength,"number") && field.length > options.maxlength){
            throw new ValidationError(new Error(`validation failed: maximum length must be ${options.maxlength}`),"validation");
        }
        if(!!options.alpha && /\W/.test(field)){
            throw new ValidationError(new Error(`validation failed: only alphanumeric characters supported`),"validation");
        }
        if(!!options.email && /^[a-z0-9._%+-]+@[a-z]{2,15}\.[a-z]{2,3}$/.test(field)){
            throw new ValidationError(new Error(`validation failed: invalid or unsupported email`),"validation");
        }
    }
    else{
        if(!!options.min && expectedType(options.min,"number") && field < options.min){
            throw new ValidationError(new Error(`validation failed: value can not be lower than ${options.min}`),"validation");
        }
        if(!!options.max && expectedType(options.max,"number") && field > options.max){
            throw new ValidationError(new Error(`validation failed: value can not be greater than ${options.max}`),"validation");
        }
    }
};