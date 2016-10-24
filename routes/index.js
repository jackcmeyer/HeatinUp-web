var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var User = mongoose.model('User');
var jwt = require('express-jwt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// register
router.post('/api/register', function(req, res, next){
    console.log("REQUEST: " + JSON.stringify(req.body));
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
  }
  var user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save(function (err){
    if(err){
      return next(err);
    }
    console.log(user);
    return res.json({token: user.generateJWT()});
  });
});

// login
router.post('/api/login', function(req, res, next){

    console.log("REQUEST: " + req.body);

  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
        console.log(user);
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
