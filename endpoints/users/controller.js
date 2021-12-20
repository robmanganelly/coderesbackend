const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const {User} = require('./model');
const { getByParamsId, postResource } = require('../../tools/factories');
const catchAsync = require('../../tools/catchAsync');

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

    return res.status(200).json({
        status:'success',
        data:{data: updatedUser},
        message: 'user successfully updated'
    });
});

module.exports.useTokenForSetParams = function(req, res, next) {
    req.params.id = req.user._id;
    next();
};

module.exports.getMyProfile = getByParamsId(User, {
    message: 'user successfully sent',
    select: 'photo username email tokenExpiration'
});
module.exports.getUser = getByParamsId(User, {message: 'user successfully sent'});
module.exports.postUser = postResource(User, {message: 'user created successfully'});
// module.exports.patchUser = createHandlerFor.patchOne(User, {message: 'changes saved successfully'});
// module.exports.deleteUser = createHandlerFor.deleteOne(User, {message: 'user deleted successfully'});

