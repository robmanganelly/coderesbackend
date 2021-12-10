const express = require('express');
const { upload, imageResizing, uploadBuffer } = require('../../tools/multerUploader');
const { getLanguages, addLanguage, deleteLanguage } = require('./controller');

const router = express.Router();
//todo validate inputs
router
    .route('')
    .get(
        getLanguages
    )
    .post(
        uploadBuffer.single("img"),imageResizing,addLanguage
    )
    .delete(
        deleteLanguage
    )
    ;



module.exports = router;
