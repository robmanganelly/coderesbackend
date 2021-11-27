const express = require('express');
const { validObjectIdParamValidator, commentBodyValidator } = require('../../middleware/validators');
const catchAsync = require('../../tools/catchAsync');
const { getComments, createComment, deleteCommentById, patchCommentById } = require('./controller');

const router = express.Router();

router
    .route('')
    .get(getComments)
    .post(commentBodyValidator,createComment)
    ;

router.route('/:id')
    .patch(validObjectIdParamValidator, patchCommentById)
    .delete(validObjectIdParamValidator, deleteCommentById)
    ;




module.exports = router;