const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
    
    problemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problems",
        required: true
    },
    text: {
        type: String,
        minlength: [5,"too short script, not allowed"],
        maxlength: [3500, " too long script, please shorten or contact me"],
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
    /* //todo, comment out and implement after create users endpoint (needs a comma).
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
    */

});

const Solutions = mongoose.model('solutions', solutionSchema);

module.exports = Solutions;