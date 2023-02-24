const express = require('express');
const bodyParser = require('body-parser');
const Promos = require('../models/promos');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsOptions, (req, res) => {res.statusCode = 200; })
.get(cors.cors, (req,res,next) => {
    Promos.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/josn');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Promos.create(req.body)
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promos);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /promo");
})
.delete(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Promos.deleteOne()
        .then((promos) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promos);
        },(err) => next(err))
        .catch((err) => next(err));
});


promoRouter.route('/:promoId')
.options(cors.corsOptions, (req, res) => {res.statusCode = 200; })
.get(cors.cors, (req,res,next) => {
    Promos.findById(req.params.promoId)
        .then((promo) => {
            if(promo != null){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(promo);
            }else{
                err = new Error('Promotion ' + req.params.promoId + ' not found');
                err.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /promo/" + req.params.promoId);
})
.put(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Promos.findByIdAndUpdate(req.params.promoId,{
        $set: req.body
    },{ new :true } )
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Promos.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/text');
        res.json('item deleted');
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;