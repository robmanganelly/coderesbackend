//todo enhance error handling

module.exports = function catchAsync(handler){
    return (req, res, next)=>{
        handler(req, res, next).catch(
            error=>{
                console.log('error inside ctch async '); // todo delete this line
                console.log(error);  // todo delete this line
                return next(error);
            }
        );
    };
};