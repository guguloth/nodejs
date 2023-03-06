const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsOptions, (req, res) => {res.statusCode = 200; })
.get(cors.cors, authenticate.verifyUser, authenticate.adminUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            // No need to check for user because the query gives as login user data
            if(req.user._id.equals(favorites.user.id)){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/josn');
                res.json(favorites);
            }else{
                res.statusCode = 403;
                res.setHeader('Content-Type','application/text');
                res.json("You are not allowed to do this operation of other user");
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req, res, next) => {
    Favorites.findOne({user:req.user._id})
        .then((favorites) => {
            if(favorites === null){
                Favorites.create({"user":req.user._id, "dishes":req.body})
                    .then((favorites) => {
                        Favorites.findById(favorites._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json(favorite);
                            },(err) => next(err))
                    },(err) => next(err))
            }else{
                var duplicate=[];
                var nonDuplicates=[];
                for( var i=0; i<=req.body.length-1; i++){
                    if(!favorites.dishes.includes(req.body[i]._id)){
                        favorites.dishes.push(req.body[i]._id);
                        nonDuplicates.push(req.body[i]._id);
                    }else{
                        duplicate.push(req.body[i]._id);
                    }
                }
                if(nonDuplicates.length > 0){
                    favorites.save()
                        .then((favorites) => {
                            Favorites.findById(favorites._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type','application/json');
                                    res.json(favorite);
                                },(err) => next(err))
                        },(err) => next(err))
                }else{
                    res.statusCode = 403;
                    res.setHeader('Content-Type','application/text');
                    res.end("All items are marked as favorites");
                }
                
            }
        },(err) => next(err))
        .catch((err) => next(err))
})


.delete(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req, res, next) => {
    Favorites.findOne({user:req.user._id})
    .then((favorites) => {
        favorites.dishes.splice(0,favorites.dishes.length);
        // favorites.dishes = [];
        favorites.save()
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favorites);
        })
    },(err) => next(err))
    .catch((err) => next(err))
})

favoriteRouter.route('/:dishId')
.options(cors.corsOptions, (req, res) => {res.statusCode = 200; })
.get(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
        .then((favorites) => {
            if(!favorites){
                res.statusCode = 200;
                res.setHeader("Content-Type","application/json");
                res.json({"exits":false,"favorite":favorites});
            }else{
                if(favorites.dishes.indexOf(req.params.dishId)>0){
                    res.statusCode = 200;
                    res.setHeader("Content-Type","application/json");
                    res.json({"exits":true,"favorite":favorites});
                }else{
                    res.statusCode = 200;
                    res.setHeader("Content-Type","application/json");
                    res.json({"exits":false,"favorite":favorites});
                }
            }
        },(err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req, res, next) => {
    Favorites.findOne({user:req.user._id})
        .then((favorites) => {
            if(favorites === null){
                Favorites.create({"user":req.user._id, "dishes":req.params.dishId})
                    .then((favorites) => {
                        Favorites.findById(favorites._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type','application/json');
                                res.json(favorite);
                            },(err) => next(err))
                    },(err) => next(err))
            }else{
                if(!favorites.dishes.includes(req.params.dishId)){
                    favorites.dishes.push(req.params.dishId)
                    favorites.save()
                        .then((favorites) => {
                            Favorites.findById(favorites._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type','application/json');
                                    res.json(favorite);
                                },(err) => next(err))
                        },(err) => next(err))
                }else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/text');
                    res.end("This dish is already added to favorite list");
                }
            }
        },(err) => next(err))
        .catch((err) => next(err))
})

.delete(cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, (req, res, next) => {
    Favorites.findOne({user:req.user._id})
    .then((favorites) => {
        var index = favorites.dishes.indexOf(req.params.dishId)
        if(index !== -1){
            favorites.dishes.splice(index,1);
        }
        favorites.save()
        .then((favorites) => {
            Favorites.findById(favorites._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                },(err) => next(err))
        })
    },(err) => next(err))
    .catch((err) => next(err))
})

module.exports = favoriteRouter;