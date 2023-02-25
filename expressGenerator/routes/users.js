var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');


/* GET users listing. */
router.get('/', cors.corsOptions, authenticate.verifyUser, authenticate.adminUser, function(req, res, next) {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(users);
    }, err => next(err))
    .catch((err) => next(err))
})
.post('/signup', cors.corsOptions, (req,res,next) => {
  User.register({username: req.body.username},req.body.password,(err,user) => {
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
      }else{
        if(req.body.firstname){
          user.firstname = req.body.firstname;
        }
        if(req.body.lastname){
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({err:err});
          }else{
            passport.authenticate('local')(req,res,() => {
              res.statusCode = 200;
              res.setHeader('Content-Type','application/json');
              res.json({success: true, status: 'Registered successful!',user:user});
            });
          }
        });
      }
    });
})

.post('/login', cors.corsOptions, passport.authenticate('local',{session: false}), (req,res,next) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success: true, token: token, status: 'Your are successfully loggedin!'});
})

router.get('facebook/token',passport.authenticate('facebook-token'),(req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success: true, token: token, status: 'Your are successfully loggedin!'});
})

.get('/logout', cors.corsOptions, (req,res,next) => {
  // if(req.session){
  //   req.session.destroy();
  //   res.clearCookie('session-id');
  //   res.redirect('/');
  // }else{
  //   var err = new Error('You are not logged in!');
  //   err.status = 403;
  //   return next(err);
  // }
})

module.exports = router;
