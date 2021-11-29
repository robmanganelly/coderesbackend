const express = require('express');
const { testMiddleware } = require('../../middleware/test-middleware');
const { validObjectIdParamValidator, multipleIdParamsValidators, problemBodyValidator } = require('../../middleware/validators');
const { getAllProblems, getProblemsByLanguageId, postProblemByLanguageId, patchProblemById, deleteProblemById } = require('./controller');

const router = express.Router();


router.route('')
    .get(getAllProblems) // todo delete this endpoint after finishing development
    ;

router.route('/:id') // language id
    .get(validObjectIdParamValidator,getProblemsByLanguageId)
    .post(multipleIdParamsValidators("id"),testMiddleware('id params'),problemBodyValidator,postProblemByLanguageId)
    ;

router.route('/:id/:problemId') // first lang id, second problem id
    .patch(multipleIdParamsValidators('id','problemId'),patchProblemById) // todo  make that: after a period of time can not be updated
    .delete(deleteProblemById)
    ;

module.exports = router;
