const express = require('express');
const { validObjectIdParamValidator, solutionBodyValidator } = require('../../middleware/validators');
const { routeGuard } = require('../../tools/route-guard');
const { getAllSolutions, postSolution, getSolutionsById, patchSolution, deleteSolution } = require('./controller');

const router = express.Router();

router.route('')
    .get(getAllSolutions) // todo delete after ending dev phase
    ;

router.route('/:id')  
    .get(validObjectIdParamValidator, getSolutionsById)  // problemId (get all solutions for certain problem)
    
    ;

router.use(routeGuard);

router.route('/:id')
    .post(validObjectIdParamValidator,solutionBodyValidator, postSolution)     // problemId is required
    .patch(validObjectIdParamValidator,solutionBodyValidator, patchSolution)   // solutionId. bot of them require 
    .delete(validObjectIdParamValidator, deleteSolution); // 


module.exports = router;