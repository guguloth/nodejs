const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null,'public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const imageFileFilter = (req, file, callback) => {
    console.log(file.originalname.match(/\.(jpg|png|jpeg|gif)$/));
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)){
        return callback(new Error('You can upload only image files!'),null);
    }else{
        callback(null,true);
    }
};
const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.options(cors.corsOptions, (req, res) => {res.statusCode = 200; })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation is not supported on /uploadRouter');
})
.put(cors.corsOptions, authenticate.verifyUser, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /uploadRouter');
})
.delete(cors.corsOptions, authenticate.verifyUser, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation is not supported on /uploadRouter');
})
.post(cors.corsOptions, authenticate.verifyUser, authenticate.verifyUser, upload.single('frontendImageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})
module.exports = uploadRouter;
