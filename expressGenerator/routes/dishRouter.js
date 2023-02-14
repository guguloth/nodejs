const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
        .then((dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/josn');
            res.json(dishes);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req,res,next) => {
    Dishes.create(req.body)
        .then((dishes) => {
            console.log("Dish is created",dishes);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/josn');
            res.json(dishes);
        }, (err) => next(err))
        .catch((err) => next(err));

})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /dishes");
})
.delete((req,res,next) => {
    Dishes.deleteOne()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/josn');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});


dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/josn');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /dishes/" + req.params.dishId);
})
.put((req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    },{ new :true } )
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/josn');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/josn');
        res.json(resp);
        console.log("removed")
    }, (err) => next(err))
    .catch((err) => next(err));
});


dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if(dish != null){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/josn');
                res.json(dish.comments);
            }
            else{
                err = new Error('Dish ' + req.params.dishId + 'not found');
                err.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if(dish != null){
                dish.comments.push(req.body);
                dish.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/josn');
                        res.json(dish);
                    }, (err) => next(err))
            }
            else{
                err = new Error('Dish ' + req.params.dishId + 'not found');
                err.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));

})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /dishes" + req.params.dishId + "/comments");
})
.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            dish.comments.deleteOne();
            dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/josn');
                    res.json(dish);
                }, (err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err));
});


dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/josn');
            res.json(dish.comments.id(req.params.commentId));
        }else if(dish == null){
                err = new Error('Dish ' + req.params.dishId + 'not found');
                err.statusCode = 404;
                return next(err);
        }else{
            err = new Error('Comment ' + req.params.commentId + 'not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /dishes/" + req.params.dishId +"comments/" + req.params.commentId);
})
.put((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/josn');
                    res.json(dish);
                },(err) => next(err))
        }else if(dish == null){
                err = new Error('Dish ' + req.params.dishId + 'not found');
                err.statusCode = 404;
                return next(err);
        }else{
            err = new Error('Comment ' + req.params.commentId + 'not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})
.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if(dish != null && dish.comments.id(req.params.commentId) != null){
                dish.comments.findByIdAndRemove(req.params.commentId)
                     .then((dish) =>{
                         dish.save()
                             .then((dish) => {
                                 res.statusCode = 200;
                                 res.setHeader('Content-Type','application/josn');
                                 res.json(dish);
                             }, (err) => next(err))
                     }, (err) => next(err))
            }else if(dish == null){
                err = new Error('Dish ' + req.params.dishId + 'not found');
                err.statusCode = 404;
                return next(err);
            }else{
                err = new Error('Comment ' + req.params.commentId + 'not found');
                err.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = dishRouter;