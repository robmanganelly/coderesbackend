const express = require('express');
const { signup, signin } = require('./controller');


const route = express.Router();


route
.route('/new')
.post(//todo create a validator for user signup
    signup)

route
.route('/login')
.post(// todo create a validator for login 
    signin)

// route
// .route('/recovery')
// .post(passwordForgotten)

// route
// .route('/reset-password/:token')
// .patch(paramValidator,passwordRecovery)


module.exports = route;
