const mongoose = require('mongoose');
const AppError = require('../../tools/appError');
const fs = require('fs');
const path = require('path');

const langSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [50,'maximum length exceeded, please shorten the language name'],
        required: true,
        minlength:[1," language name can not be empty"],
        trim: true,
        unique: true

    },
    img:{
        type: String,
        maxlength: [100,'maximum length exceeded, please shorten the image name'],
        required: true,
        minlength:[3," image name can not be too short in order to avoid conflicts"],
        validate:{
            validator:(input)=>{
                let tAr = input.split('.');
                return ['png','jpg','jpeg'].includes(tAr[tAr.length-1]); 
            },
            message:"only 'png' or 'jpg'/'jpeg' extensions allowed"

        }
    }
});

langSchema.pre('save',async function(next){
    const existent = await this.constructor.find({name:this.name});
    if (existent.length === 0){
        return next();
    }else{
        fs.unlink(path.join(__dirname,'../../static/img',this.img),(error)=>{
            if(!!error){console.log(error);} // add a logger maybe || remove this line
        });
        return next(new AppError("bad request: wrong input, this language exists already",400));
    }
});


const Lang = mongoose.model('languages', langSchema);

module.exports = Lang;