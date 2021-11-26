const express = require('express');
const { paramsValidator } = require('../../middleware/validators');
const { getComments, createComment, deleteCommentById } = require('./controller');

const router = express.Router();

router
    .route('')
    .get(getComments)
    .post(createComment)
    ;

router.route('/:id')
    .patch()
    .delete(paramsValidator, deleteCommentById)
    ;




module.exports = router;