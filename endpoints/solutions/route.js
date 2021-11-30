const express = require('express');
const { validObjectIdParamValidator } = require('../../middleware/validators');
const { getAllSolutions, postSolution, getSolutionsById, patchSolution, deleteSolution } = require('./controller');

const router = express.Router();

router.route('')
    .get(getAllSolutions) // todo delete after ending dev phase
    .post(postSolution)
    ;

router.route(':id')  // todo add validators here
    .get(validObjectIdParamValidator,getSolutionsById) // problemId (get all solutions for certain problem)
    .patch(validObjectIdParamValidator,patchSolution) // solutionId. bot of them require 
    .delete(validObjectIdParamValidator,deleteSolution) // 
    ;


module.exports = router;