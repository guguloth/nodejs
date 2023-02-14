var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var Dishes = require('./models/dishes');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4 // Use IPv4, skip trying IPv6
  
}
mongoose.set('strictQuery', false);

const url = "mongodb://localhost:27017/confusion";
const connect = mongoose.connect(url,options);

connect.then(() => {
  console.log("connected correctly to server");
},(err) => {
  console.log(err);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-01236-78955-98745'));

function auth(req,res,next){
  console.log(req.signedCookies);

  if(!req.signedCookies.username){
      var authHeader = req.headers.authorization;
      if(!authHeader){
        var err = new Error('You are not authenticated!');
        res.setHeader('www-Authenticate','Basic');
        err.status = 401;
        return next(err);
      }else{
        var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
        var username = auth[0];
        var password = auth[1];
    
        if(username === 'admin' && password === 'password'){
          res.cookie('user','admin',{signed:true});
          next();
        }else{
          var err = new Error('You are not authenticated!');
          res.setHeader('www-Authenticate','Basic');
          err.status = 401;
          return next(err);
        }
      }
  }else{
    if(req.signedCookies.user === 'admin'){
      next();
    }else{
      var err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter);
app.use('/promos',promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
