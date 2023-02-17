var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');
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

.post('/login', passport.authenticate('local'), (req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success: true, status: 'Your are successfully loggedin!'});
})

.get('/logout',(req,res,next) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
