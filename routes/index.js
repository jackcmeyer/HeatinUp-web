var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var path = require('path');
var passport = require('passport');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
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

router.post('/api/addNewLocation', function(req, res, next) {
  if(!req.body.latitude || !req.body.longitude || !req.body.username) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var location = new Location();
  location.username = req.body.username;
  location.latitude = req.body.latitude;
  location.longitude = req.body.longitude;
  location.time = moment().format("MM-DD-YYYY");

  console.log(location);

  location.save(function(err) {
    if(err){
      return next(err);
    }
    else {
      return res.status(200).json({message: "Success"});
    }
  });

});

router.post('/api/getLocationDataForUser', function(req, res, next) {
  if(!req.body.username) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var data = Location.find({username: req.body.username}, function(error, results) {
    if(error) {
      res.status(400).json("Server Error");
    }

    else {
      console.log(results);
      res.json(results);
    }
  });
});

module.exports = router;
