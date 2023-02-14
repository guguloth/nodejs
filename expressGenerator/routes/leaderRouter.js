const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/josn');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Leaders.create(req.body)
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /leader");
})
.delete((req,res,next) => {
    Leaders.deleteOne()
        .then((leaders) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        },(err) => next(err))
        .catch((err) => next(err));
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
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
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /leader/" + req.params.leaderId);
})
.put((req,res,next) => {
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
.delete((req,res,next) => {
    Leaders.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/text');
        res.json('item deleted');
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;