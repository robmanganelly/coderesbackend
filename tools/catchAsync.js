//todo enhance error handling

const AppError = require("./appError");
const ValidationError = require("./validationError");

module.exports = function catchAsync(handler){
    return (req, res, next)=>{
        handler(req, res, next).catch(
            error=>{

                console.log("\n\n\n catching async error");
                console.log(error);
                console.log("\n\n\n catching async error");

                
                if (!error.statusCode){ error = new AppError(error.message, 500);} // todo change this line to catch uncaught exceptions, mongo errors must be caught in a different way.

                return next(error);
            }
        );
    };
};