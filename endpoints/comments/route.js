const express = require('express');
const { validObjectIdParamValidator, commentBodyValidator } = require('../../middleware/validators');
const { getComments, createCommentBySolutionId, deleteCommentById, patchCommentById, getCommentsBySolutionId } = require('./controller');

const router = express.Router();
const {routeGuard} = require('./../../tools/route-guard');


router
    .route('')
    .get(getComments) // todo remove after ending dev phase. 
    ;

    router.route('/:id')   
    .get(validObjectIdParamValidator, getCommentsBySolutionId);


router.use(routeGuard);

router.
    route('/:id')
    .post(validObjectIdParamValidator,commentBodyValidator,createCommentBySolutionId)
    .patch(validObjectIdParamValidator, patchCommentById) 
    .delete(validObjectIdParamValidator, deleteCommentById)
    ;




module.exports = router;