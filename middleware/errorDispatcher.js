const { responseWrapper } = require("../tools/factories");

module.exports = function errorHandler(err, req,res,next){
    // sources: operational(validation, caught exception, email)
    
    // console.log(err);   // todo remove this line after testing

    if (process.env.NODE_ENV === "development"){
        console.log(err);
    }

    return responseWrapper(res, err.statusCode, err,err.message );

};