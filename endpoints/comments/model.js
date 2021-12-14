const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    /* 
    author:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: true
    }, 
    */ // todo turn on after Users collection created

    source:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solutions',
        required: [true, "a source for the comment is mandatory"]
    },

    date: {
        type: Date,
        default: Date.now()
    },

    text:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 2500
    }

});


const Comment = mongoose.model("comments",commentSchema);

module.exports = Comment;