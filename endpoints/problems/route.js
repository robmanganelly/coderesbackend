const express = require('express');
const { validObjectIdParamValidator, multipleIdParamsValidators, problemBodyValidator, deferredProblemBodyValidator } = require('../../middleware/validators');
const { getAllProblems, getProblemsByLanguageId, postProblemByLanguageId, patchProblemById, deleteProblemById } = require('./controller');

const router = express.Router();


router.route('')
    .get(getAllProblems) // todo delete this endpoint after finishing development
    ;

router.route('/:id') // language id
    .get(validObjectIdParamValidator,getProblemsByLanguageId)
    .post(multipleIdParamsValidators("id"),problemBodyValidator,postProblemByLanguageId)
    .patch(multipleIdParamsValidators('id'),deferredProblemBodyValidator,patchProblemById) // the patch uses the prob id instead of language id// todo  make that: after a period of time can not be updated
    .delete(deleteProblemById)    
    ;

module.exports = router;
