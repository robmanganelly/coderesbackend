const express = require('express');
const { getLanguages, addLanguage, deleteLanguage } = require('./controller');

const router = express.Router();

router
    .route('')
    .get(
        getLanguages
    )
    .post(
        addLanguage
    )
    .delete(
        deleteLanguage
    )
    ;



module.exports = router;
