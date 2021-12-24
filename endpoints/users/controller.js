const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const {User} = require('./model');
const factories = require('../../tools/factories');
const catchAsync = require('../../tools/catchAsync');
const AppError = require('../../tools/appError');
const Problem = require('./../problems/model');
const Solution = require('./../solutions/model');


//profile
module.exports.profileUpdating = catchAsync(async function(req, res, next) {

    const {oldPassword, updatedPassword} = req.body;
    if (!oldPassword || !updatedPassword || (oldPassword === updatedPassword)) {
        return next(new AppError('Invalid input, please provide both the current and new password. Don\'t use the same ', 400));
    }

    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(lackOfPermissionsError);

    const payload = await promisify(jwt.verify)(token, process.env.JWT_KEY);

    const user = await User.findById(payload.id);
    if (!user || !(await user.verifyPassword(oldPassword))) return next(lackOfPermissionsError);

    user.password = updatedPassword;
    await user.save();

    const newToken = jwtSign(user._id);

    return res.status(200).json({
        status: 'success',
        token: newToken
    });
});

module.exports.passwordUpdating = catchAsync(async function (req, res, next){ // todo review
    // not allowed for password role or email, or any other sensitive field
    if (req.body.password || req.body.role || req.body.email ) return next(new AppError(
        'not allowed to edit sensitive fields',403));
    let filtered = bodyFilter(req,'username', 'photo');
    if (req.file) filtered.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filtered,
        {runValidators: true, new:true}
    );

    if (!updatedUser) return next(new AppError('user can not be found',400));

    return factories.responseWrapper(res, 200, updatedUser, 'user successfully updated');
});

module.exports.useTokenForSetParams = function(req, res, next) {
    req.params.id = req.user._id;
    next();
};

module.exports.getMyProfile = factories.getByParamsId(User, {
    message: 'user successfully sent',
    select: 'photo username email tokenExpiration favSolutions favProblems'
});
module.exports.getUser = factories.getByParamsId(User, {message: 'user successfully sent'});
module.exports.postUser = factories.postResource(User, {message: 'user created successfully'});
// module.exports.patchUser = createHandlerFor.patchOne(User, {message: 'changes saved successfully'});
// module.exports.deleteUser = createHandlerFor.deleteOne(User, {message: 'user deleted successfully'});

module.exports.manageFavorites = catchAsync(async(req, res, next)=>{
    const {_id} = req.user;
    const { favorite, source, action } = req.query;
    console.log(req.query); // todo remove this after  testing

    if(!_id ||!favorite || !["problems","solutions"].includes(source) || !["add","remove"].includes(action) ){
        return next(new AppError('missing or invalid data, check your input',400));
    }

    const isProblem = source === "problems";
    const isAdding = action === "add";

    const favoriteItem =  isProblem ?
            await Problem.findById(favorite)
         :  await Solution.findById(favorite);
        
    if(!favoriteItem) return next(new AppError("the requested resource was not found on this server",404));

    const userUpdatedFavorites = isAdding ?
          isProblem?
              await User.findByIdAndUpdate(_id,{$addToSet:{favProblems: favoriteItem._id}},{new:true})
            :
              await User.findByIdAndUpdate(_id,{$addToSet:{favSolutions: favoriteItem._id}},{new:true})
        : 
          isProblem?
              await User.findByIdAndUpdate(_id,{$pullAll : {  favProblems: [favoriteItem._id]}},{new:true})
            : 
              await User.findByIdAndUpdate(_id,{$pullAll : {  favSolutions: [favoriteItem._id]}},{new:true});

    return factories.responseWrapper(
        res,200,
        userUpdatedFavorites[isProblem?"favProblems":"favSolutions"], "favorites updated"
        // ,{temp: favoriteItem._id, isProblem, isAdding} // todo remove this after testing
    );
});
