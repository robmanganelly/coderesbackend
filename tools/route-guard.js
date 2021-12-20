const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const AppError = require('./appError');
const {User} = require('./../endpoints/users/model');
const catchAsync = require('./catchAsync');

module.exports.routeGuard = catchAsync(async function (req, res, next){
    // the err message is the same on purpose
    const getTheF_Out = new AppError('Unauthorized: Invalid or Nonexistent credentials',401);

    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(getTheF_Out );
    
    const payload = await promisify(jwt.verify)(token,process.env.JWT_KEY);
    const user = await User.findById(payload.id);

    if (!user) return next( getTheF_Out);
    if ( ! user.hasSamePasswordSince(payload.iat) )return next( getTheF_Out ); 
    req.user = user; // further use...
    next(); 
});


module.exports.allowOnly = function( ...roles ){
    return catchAsync(( req, res, next)=>{
        if ( !roles.includes(req.user.role) ){
            return next(new AppError('Access Denied!! Not enough permissions',401));
        }
        return next();
    });    
};