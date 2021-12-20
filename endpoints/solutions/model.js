const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    
    problemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problems",
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
    }
    /* //todo, comment out and implement after create users endpoint (needs a comma).
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
    */

});

solutionSchema.pre('save',function(next){
    // todo : delete
    next();

});

const Solutions = mongoose.model('solutions', solutionSchema);

module.exports = Solutions;