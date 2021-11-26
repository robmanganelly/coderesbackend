const express = require('express');
const { getLanguages, addLanguage } = require('./controller');

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
        //
    )
    ;



module.exports = router;
