const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');
const cors = require('./cors');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsOptions, (req, res) => {res.statusCode = 200; })
.get(cors.cors, (req,res,next) => {
    Leaders.find(req.query)
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/josn');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Leaders.create(req.body)
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /leader");
})
.delete(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Leaders.deleteOne()
        .then((leaders) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        },(err) => next(err))
        .catch((err) => next(err));
});


leaderRouter.route('/:leaderId')
.options(cors.corsOptions, (req, res) => {res.statusCode = 200; })
.get(cors.cors, (req,res,next) => {
    Leaders.findById(req.params.leaderId)
        .then((leader) => {
            if(leader != null){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(leader);
            }else{
                err = new Error('Leader ' + req.params.leaderId + ' not found');
                err.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /leader/" + req.params.leaderId);
})
.put(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },{ new :true } )
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Leaders.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/text');
        res.json('item deleted');
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;