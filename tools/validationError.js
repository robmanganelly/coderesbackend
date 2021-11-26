module.exports = class ValidationError extends Error{
    constructor(baseError,source="mongoValidation"){
        super(baseError.message || "unknown (no message) error");
        
        this.statusCode = 400;
        this.status = "validation failed";       
        this.sourceError = source;
        this.isOperational = true;
        this.message = baseError.message;

        
        Error.captureStackTrace(this,this.constructor);
    }
};