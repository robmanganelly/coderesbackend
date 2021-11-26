const objectId = require("mongoose").Types.ObjectId;
const ValidationError = require('./../tools/validationError')
module.exports.bodyValidator = async(req, res, next)=>{
    //
};

module.exports.paramsValidator = async(req, res, next)=>{
    if (!req.params.id || objectId.isValid(req.params.id)){
        next();
    }else{
        next(new ValidationError(new Error(`bad request: wrong value for id ${req.params.id}`),"validation"));
    }

};