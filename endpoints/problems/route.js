const express = require('express');
const { validObjectIdParamValidator, multipleIdParamsValidators, problemBodyValidator, deferredProblemBodyValidator } = require('../../middleware/validators');
const { getAllProblems, getProblemsByLanguageId, postProblemByLanguageId, patchProblemById, deleteProblemById } = require('./controller');

const router = express.Router();


router.route('')
    .get(getAllProblems) // todo delete this endpoint after finishing development
    ;

router.route('/:id') // language id
    .get(validObjectIdParamValidator,getProblemsByLanguageId)
    .post(validObjectIdParamValidator,problemBodyValidator,postProblemByLanguageId)
    .patch(validObjectIdParamValidator,deferredProblemBodyValidator,patchProblemById) // the patch uses the prob id instead of language id// todo  make that: after a period of time can not be updated
    .delete(validObjectIdParamValidator,deleteProblemById)    
    ;

module.exports = router;
