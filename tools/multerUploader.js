const sharp = require('sharp');
const path = require('path');
const multer = require('multer');
const AppError = require('./appError');

const mimetypes = {
    'image/png':'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storageFilter = (req, file, callback) => {
    const validMimeType = mimetypes[file.mimetype];
    let error = new AppError(`wrong mimetype ${file.mimetype}: only supported png or jpg extensions`);

    if (validMimeType){
        error = null;
    }
    callback(error, './../static/img');
};


const appStorage = multer.diskStorage({   // for directly store images
    destination: storageFilter ,
    filename:(req, file, callback) =>{
        const extension = mimetypes[file.mimetype];
        callback(null,`lang_${Date.now()}_${req.user._id || "no_user"/*remove this */}.${extension}`);
    }
});

const memoryStorage = multer.memoryStorage();

// image handling using sharp module....
 module.exports.imageResizing  = async function(req, res, next){
    try {    
        if (!req.file) {
            console.log('calling next on no file <multer upload>');//todo change to a logger
            return next();
        }
        //todo change this after user id implemented
        const newImageName = `${Date.now()}${Math.floor(Math.random()*10**12)}.png`;

        //await sharp(req.file[0].buffer)// for arrays of images
        await sharp(req.file.buffer)// for arrays of images
        .resize(200,200)
        .toFormat('png',{})
        .png({quality: 90})
        // .toFile(path.join(__dirname,'/../static/img',req.file[0].filename)); // previous version
        // look the index req.file[0] for arrays and the different name;
        // .toFile(path.join( __dirname,'/../static/img',req.file.originalname));
        // req.body.img = req.file[0].filename;
        .toFile(path.join( __dirname,'/../static/img',newImageName));
        req.body.img = newImageName;
        next();
    } catch (error) {
        console.log('error on resizing image'); // todo remove this
        console.log(error);                     // todo remove this line after testing
        return new AppError('oops....',500);
    }
};
module.exports.upload = multer({storage: appStorage });
module.exports.uploadBuffer = multer({storage: memoryStorage, fileFilter: storageFilter });
