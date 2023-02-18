var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');
const authenticate = require('../authenticate');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})
.post('/signup',(req,res,next) => {
  User.register({username: req.body.username},req.body.password,(err,user) => {
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
})

.post('/login', passport.authenticate('local',{session: false}), (req,res,next) => {
  var token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success: true, token: token, status: 'Your are successfully loggedin!'});
})

.get('/logout',(req,res,next) => {
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
