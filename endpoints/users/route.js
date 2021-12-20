const express = require('express');
const route = express.Router();

const {profileUpdating, getMyProfile, passwordUpdating, useTokenForSetParams} = require("./controller");
const {routeGuard} = require('./../../tools/route-guard');
const {upload} = require('./../../tools/multerUploader');

route.use(routeGuard); // all routes below require a logged user


route
    .route('/profile')
    .get(
        useTokenForSetParams,
        getMyProfile
    );


route
    .route('/profile/editions')
    .patch(upload.single('file'),profileUpdating);
route
    .route('/profile/password')
    .patch(
        //todo implement password validation and place here */
        passwordUpdating
    );

module.exports = route;
