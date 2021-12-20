const express = require('express');
const { validObjectIdParamValidator, commentBodyValidator } = require('../../middleware/validators');
const catchAsync = require('../../tools/catchAsync');
const { getComments, createCommentBySolutionId, deleteCommentById, patchCommentById, getCommentsBySolutionId } = require('./controller');

const router = express.Router();

router
    .route('')
    .get(getComments) // todo remove after ending dev phase. 
    ;

    router.route('/:id')   
    //todo add here a 
    // todo change this after adding users endpoint: this endpoint must reflect the user status, so no one can patch or delete other people's comment 
    .get(validObjectIdParamValidator, getCommentsBySolutionId)
    .post(validObjectIdParamValidator,commentBodyValidator,createCommentBySolutionId)
    .patch(validObjectIdParamValidator, patchCommentById) 
    .delete(validObjectIdParamValidator, deleteCommentById)
    ;




module.exports = router;