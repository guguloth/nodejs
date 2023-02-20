const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const jwtStrategy = require('passport-jwt').Strategy;
const jwtExtract = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretekey, {expiresIn:3600});
};

var opts = {};
// option specifies how web token is extracted from incomming request
opts.jwtFromRequest = jwtExtract.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretekey;
exports.jwtPassport = passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    console.log("jwt payload : "+JSON.stringify(jwt_payload));
    User.findOne({_id: jwt_payload._id}, (err,user) => {
        if(err){
            return done(err,false);
        }else if(user){
            return done(null,user);
        }else{  
           return done(null,false);
        }
    });
}));

exports.adminUser = function(req, res, next) {
    console.log(req)
    if (req.user.admin){
      return next();
    } else {
      var err = new Error('Only administrators are authorized to perform this operation.');
      err.status = 403;
      return next(err);
    }
};

exports.verifyUser = passport.authenticate('jwt',{'session':false});