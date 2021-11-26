//todo enhance error handling

const ValidationError = require("./validationError");

module.exports = function catchAsync(handler){
    return (req, res, next)=>{
        handler(req, res, next).catch(
            error=>{
                console.log('error inside catch async '); // todo delete this line
                console.log(error);  // todo delete this line

                if (!error.statusCode){ error = new ValidationError(error);}

                return next(error);
            }
        );
    };
};