const { responseEnveloper } = require("../tools/factories");

module.exports = function errorHandler(err, req,res,next){
    // sources: operational(validation, caught exception, email)
 

    return responseEnveloper(res, err.statusCode, err,err.message );

};