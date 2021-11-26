const { responseEnveloper } = require("../tools/factories");

module.exports = function errorHandler(err, req,res,next){
    // sources: operational(validation, caught exception, email)

    console.log('error capturado');
    console.log({...err}); // todo remove this line after ending development

    // todo enhance error handling

    return responseEnveloper(res, err.statusCode, err );

};