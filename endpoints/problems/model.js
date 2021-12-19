const mongoose = require('mongoose');
const AppError = require('../../tools/appError');

const problemSchema = new mongoose.Schema({
    language:{   // todo evaluate if a reference is really required in model. 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Languages",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    /*  // todo enable this field after create user collection
    author:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: true
    },
     */
    title:{
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
    // ,
    // is_New:{
    //     type: Boolean,
    //     get: function(){return Date.now() - this.date <= 24*3600*1000; }
    // }    
},{
    toJSON:{ virtuals: true, getters: true},
    toObject:{ virtuals: true, getters: true}
});

// problemSchema.virtual('isNew').get(
//     function(){return Date.now() - this.date <= 24*3600*1000; }
// );
// problemSchema.post(/^find/,async function(result){
    
//     result.forEach(problem => {
//         problem.is_New = Date.now() - problem.date <= 12*3600*1000;
//     });
// });

const Problem = mongoose.model('problems', problemSchema);

module.exports = Problem;