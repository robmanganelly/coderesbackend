const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    
    problemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    },
    solution: {
        type: String,
        minlength: [5,"too short script, not allowed"],
        maxlength: [3500, " too long script, please shorten"],
        required: true,
        trim: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    liked:[mongoose.Schema.Types.ObjectId],
    disliked:[mongoose.Schema.Types.ObjectId]
    
    // todo create logic on model for implement like dislike

});

solutionSchema.pre('save',function(next){
    // todo : delete
    next();

});

const Solutions = mongoose.model('solutions', solutionSchema);

module.exports = Solutions;