const mongoose = require('mongoose');
const AppError = require('../../tools/appError');

const problemSchema = new mongoose.Schema({
    language:{  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    author:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },   
    title:{
        set: function(v){ return v.charAt(0).toUpperCase() + v.slice(1);  },
        type: String,
        required: true,
        trim:true,
        minlength: [10, "title not enough descriptive"],
        maxlength: [300, "title too long, please choose a title shorter than 300 characters"]
    },
    description:{
        type: String,
        maxlength: [500, 'description can not be longer than 500 characters'] 
    }    
});

// problemSchema.virtual('is_New').get(
//     function(){return Date.now() - this.date <= 24*3600*1000; }
// );

// problemSchema.post(/^find/,async function(result){
    
//     result.forEach(problem => {
//         problem.is_New = Date.now() - problem.date <= 12*3600*1000;
//     });
// });

const Problem = mongoose.model('problems', problemSchema);

module.exports = Problem;