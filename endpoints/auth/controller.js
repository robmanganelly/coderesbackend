const crypto  = require('crypto');

const {jwtSign} = require('./../../tools/jwtHandler');
const {responseWrapper} = require('./../../tools/factories');
const catchAsync = require('../../tools/catchAsync');
const AppError = require('../../tools/appError');
const { User } = require('./../users/model');

function sendCookie(user, statusCode, res) {
    const token = jwtSign(user._id);
    const cookieExpiration = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION *24*3600*1000);
    const cookieOptions = {
        expires: cookieExpiration,
        secure: process.env.NODE_ENV === 'production' ? true : undefined,
        httpOnly:true
    };
    res.cookie('jwt',token, cookieOptions);
    
    return responseWrapper(res,statusCode,token);
}

module.exports.signup = catchAsync(async function(req, res, next){
    const newUser = await User.create({
        username:req.body.username,
        email: req.body.email,
        password: req.body.password ,
        role: req.body.role
    });
    return sendCookie(newUser,201,res);
});


module.exports.signin = catchAsync(async function(req, res, next){
    const { email, password } = req.body;

    if(!email || !password){
        const error = new AppError('email and password are required',400);
        return next(error);
    }
    const user = await User.findOne({email}).select('+password');
    if (!user || !(await user.verifyPassword(password)) ){
        return next(new AppError('invalid credentials',401));
    }
    return sendCookie(user,201,res);
});

// missing email provider in order to send emails
// module.exports.passwordForgotten = catchAsync(async function(req, res, next) {
//     const email  = req.body.email;
//     if (!email) return next(new AppError('please provide a valid email',400));

//     const user = await User.findOne({email});
//     if (!user) return next(new AppError('This email does not belong to any known user, please provide a registered email ',404));

//     const resetToken = user.createResetToken();
//     await user.save();

//     try{
//         const email_info = await new Email( // implement email class for recovery
//             user,req.protocol,req.get('host'),'api','v1','portal','reset-password',`${resetToken}`
//         ).sendPasswordRecoveryEmail();
//         if (process.env.NODE_ENV === 'development'){console.log(email_info)}
//         return responseWrapper(
//             res,200,
//             {token: ' a reset Token has been sent to your email. please check it'},
//             ' a reset Token has been sent to your email. please check it',);
//     }catch(error){
//         user.resetToken = undefined;
//         user.resetTokenExpiration = undefined;
//         await user.save();
//         return next(new AppError(`${error.message}`,500));
//     }
// });

// module.exports.passwordRecovery = catchAsync(async function(req, res, next) {
//     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
//     const user = await User.findOne( {resetToken: hashedToken, resetTokenExpiration: { $gt: Date.now() } } );
//     /*the expiration is tested on the query.*/
//     if (!user) return next(new AppError('Invalid Or Expired Token, please get a new one',401));

//     user.password = req.body.password;
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;

//     await user.save();

//     const token = jwtSign(user._id);
//     return res.status(200).json({
//         status:'success',
//         token
//     });


// });


