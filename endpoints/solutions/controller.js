const mongoose = require('mongoose');

const AppError = require('../../tools/appError');
const { responseWrapper } = require('../../tools/factories');
const catchAsync = require('./../../tools/catchAsync');
const Solution = require('./model');
const Problem = require('./../problems/model');
const { User } = require('../users/model');

module.exports.getAllSolutions = catchAsync(async(req, res, next)=>{

    const allSolutions = await Solution.find({});

    if (!allSolutions){
        return next(new AppError("unknown internal error",500));
    }

    return responseWrapper(res, 200,allSolutions);
});

module.exports.postSolution = catchAsync(async(req, res, next)=>{
    
    const problemId = req.params.id;
    const {solution} = req.body;
    const {_id} = req.user; // the auth guard provides the user.
        
    if(!problemId || !solution || !_id) return next(new AppError("invalid or missing data, can not create solution",400));

    const existentProblem = await Problem.findById(problemId);

    if (!existentProblem){ return next(new AppError("the requested resource was not found on this server",404));}

    const existentSolution = await Solution.findOne({problemId, postedBy: _id});
    if(existentSolution){
        return next(new AppError('can not post duplicate solutions',400));
    }

    const newSolution = await Solution.create({problemId, solution, postedBy: _id});

    return responseWrapper(res, 201,newSolution);

});

module.exports.getSolutionsById = catchAsync(async(req, res, next)=>{
    const {id} = req.params;

    const allSolutions = await Solution.find({problemId: id}).populate({path: 'postedBy', select: 'username'});
    if (!allSolutions){
        return next(new AppError("the requested solutions does not exist on this server",404));
    }

    return responseWrapper(res, 200, allSolutions);

});

module.exports.patchSolution = catchAsync(async(req, res, next)=>{
        
    const {id} = req.params;
    const {solution} = req.body;
    const {_id} = req.user;
    const {state} = req.query;

    console.log(req.query);
    console.log(solution);

    const objectState = ["-1","0","1"].includes(state) ? state*1 : null; //(-1,0,1)

    if (!id || !(solution || ["-1","0","1"].includes(state) )  || !_id){
        return next(new AppError("bad request: invalid or missing data",400));
    }

    if(!!solution){
        const updatedSolution =  await Solution.findOneAndUpdate(
                {_id:id, postedBy:_id},
                solution, // solution can be empty: for the cases of like dislike (route recycling)
                {new: true}
        );
        
        if(!updatedSolution){ return next(new AppError('can not update the requested resource, check your input',400));}

        return responseWrapper(res,201,updatedSolution);
        
    }else{
        const userid = mongoose.Types.ObjectId(_id);

        const session = await Solution.startSession();

        session.startTransaction();

        let stateChangedSolution; // 

        try{
            const {options} = session;

            switch (objectState) {
                case -1:
                    stateChangedSolution = await Solution.findByIdAndUpdate(id,{
                        $addToSet:{ disliked: userid },
                        $pull: { liked: userid }
                    },{new: true, ...options});

                    if(!stateChangedSolution){
                        throw new AppError('incorrect data, please verify your input: not such solution',400);
                    }

                    const solutionRemovedFromUserFavorites = await User.findByIdAndUpdate(_id,{
                        $pull:{ favSolutions: stateChangedSolution._id }
                    },{new: true, ...options});

                    if(!solutionRemovedFromUserFavorites){
                        throw new AppError('incorrect data, please verify your input: not such solution',400);
                    }

                    await session.commitTransaction();
                    session.endSession();

                    return responseWrapper(res, 200, {
                        solution:stateChangedSolution,
                        favSolutions: solutionRemovedFromUserFavorites.favSolutions // todo return the user favSolutions to update fronted
                    }); 
                    
                case 1:
                    stateChangedSolution = await Solution.findByIdAndUpdate(id,{
                        $addToSet:{ liked: userid },
                        $pull: { disliked: userid }
                    },{new: true, ...options});

                    if(!stateChangedSolution){
                        throw new AppError('incorrect data, please verify your input: not such solution',400);
                    }

                    await session.commitTransaction();
                    session.endSession();

                    return responseWrapper(
                        res, 200, {
                        solution:stateChangedSolution
                    });
                                
                default: // 0
                    stateChangedSolution = await Solution.findByIdAndUpdate(id,{
                        $pull:{ liked: userid, disliked: userid }
                    },{new: true, ...options});

                    if(!stateChangedSolution){
                        throw new AppError('incorrect data, please verify your input: not such solution',400);
                    }

                    await session.commitTransaction();
                    session.endSession();

                    return responseWrapper(
                        res, 200, {
                            solution:stateChangedSolution,
                        });
            }
        }catch(error){
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

    }
        
           

    

});


module.exports.deleteSolution = catchAsync(async(req, res, next)=>{
    
    const {id} = req.params;
    const {_id } = req.user;

    // todo add later user permissions (only posts owners and admins can delete posts)

    const deleted = await Solution.findOneAndDelete({_id:id, postedBy:_id});

    if(!deleted){return next(new AppError('can not delete the requested resource',404)); }
    return responseWrapper(res, 204,"no data");

});

