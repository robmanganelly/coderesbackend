const express = require('express');
const route = express.Router();

const {profileUpdating, getMyProfile, passwordUpdating, useTokenForSetParams, manageFavorites} = require("./controller");
const {routeGuard} = require('./../../tools/route-guard');
const {upload, uploadBuffer, imageResizing} = require('./../../tools/multerUploader');


route.use(routeGuard); // all routes below require a logged user

route
    .route('/profile')
    .get(
        useTokenForSetParams,
        getMyProfile
    );


route
    .route('/profile/edition')
    .patch(uploadBuffer.single('photo'),imageResizing,profileUpdating);
route
    .route('/profile/password')
    .patch(
        //todo implement password validation and place here */
        passwordUpdating
    );

route
   .route('/favorites')
   .patch(manageFavorites);

module.exports = route;
