var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var path = require('path');
var passport = require('passport');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var Company = mongoose.model('Company');
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

/**
 * Adds a new location for a username
 *
 * @param username {String}
 * @param latitude {Number}
 * @param longitude {Number}
 */
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

// LOCATION STUFF

/**
 * Gets all location data for a user.
 *
 * @param username {String}
 */
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

/**
 * Gets all locating data in the database.
 */
router.post('/api/getLocationDataForAll', function(req, res, next) {
  var data = Location.find({}, function(error, results) {
    if(error) {
      res.status(400).json("server error");
    }

    else {
      console.log(results);
      res.json(results);
    }
  });
});

/**
 * Get Location Data For User By Date
 *
 * @param username {String}
 * @param time {MM-DD-YYYY}
 */
router.post('/api/getLocationDataForUserByDate', function(req, res, next) {
  if(!req.body.username || !req.body.time) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var data = Location.find({username: req.body.username, time: req.body.time}, function(error, results) {
    if(error) {
      res.status(400).json("server error");
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

/**
 * Gets the location data for all the users.
 *
 * @param time {MM-DD-YYYY}
 */
router.post('/api/getLocationDataForAllByDate', function(req, res, next) {
  if(!req.body.time) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var data = Location.find({time: req.body.time}, function(error, results) {
    if(error) {
      res.status(400).json("server error");
    }

    else {
      console.log(results);
      res.json(results);
    }
  });
});

/**
 * Gets the points at where to users intersected on the same day.
 *
 * @param username1 {String}
 * @param username2 {String}
 * @param time {MM-DD-YYYY}
 */
router.post('/api/getIntersection', function(req, res, next) {
    if (!req.body.username1 || !req.body.username2 || !req.body.time) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    Location.find({username: req.body.username1, time: req.body.time}, function (error, results) {
        if (error) {
            res.status(400).json("server error");
        }

        else {
            user1data = results;

            Location.find({username: req.body.username2, time: req.body.time}, function (error, results) {
                if (error) {
                    res.status(400).json("server error");
                }

                else {
                    user2data = results;
                    console.log(user1data);
                    console.log(user2data);


                    var intersectionPoints = [];
                    for (var i = 0; i < user1data.length; i++) {
                        for (var j = 0; j < user2data.length; j++) {

                            console.log(user1data[i].latitude + ", " + user1data[i].longitude + " === " + user2data[j].latitude + ", " + user2data[j].longitude);
                            if ((user1data[i].latitude == user2data[j].latitude) && (user1data[i].longitude == user2data[j].longitude)) {
                                intersectionPoints.push({
                                    'latitude': user1data[i].latitude,
                                    'longitude': user1data[i].longitude
                                });
                            }
                        }
                    }

                    res.json(intersectionPoints);
                }
            });
        }
    });
});

// COMPANY STUFF
/**
 * Creates a new company
 *
 * @param name {String} The name of the company
 * @param owner {String} The owner's username
 */
router.post('/api/createCompany', function(req, res, next) {
  if(!req.body.name || !req.body.owner) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var company = new Company();
  company.owner = req.body.owner;
  company.name = req.body.name;
  company.members.push(req.body.owner);

  company.save(function(error) {
      if (error) {
          return next(error);
      }

      else {
          return res.status(200).json({message: "Success"});
      }
  });
});

router.post('/api/deleteCompany', function(req, res, next) {
    if(!req.body.companyID) {
        return res.status(400).json({message: "Please fill out all fields"});
    }

    Company.remove({"_id": req.body.companyID}, function(error) {
        if(error) {
            return next(error);
        }

        else {
            res.status(200).json({message: "Successfully deleted company"});
        }

    })
});

/**
 * Gets all companies for an owner
 *
 * @param username {String} The owner's username
 */
router.post('/api/getCompaniesForOwner', function(req, res, next) {
  if(!req.body.username) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  Company.find({'owner': req.body.username}, function(error, results) {
      if(error) {
          return next(error);
      }

      else {
          return res.json(results)
      }
  });
});

/**
 * Get all company location data for company
 *
 * @param companyID {String} The company id
 */
router.post('/api/getAllLocationDataForCompany', function(req, res, next) {
   if(!req.body.companyID) {
       return res.status(400).json({message: 'Please fill out all fields'});
   }

    Company.findOne({"_id": req.body.companyID}, function(error, result) {
       if(error) {
           return next(error);
       }

       else {
            Location.find({'username': {$in: result.members}}, function(error, results) {
                if(error){
                    return next(error);
                }

                else {
                    res.json(results);
                }


            })

       }
    });

});

/**
 * Get company location data by date.
 *
 * @pram comanyID {String} The company id
 * @param time {MM-DD-YYYY} The day
 */
router.post('/api/getAllLocationDataForCompanyByDate', function(req, res, next) {
   if(!req.body.companyID || !req.body.time) {
       return res.status(400).json({message: 'Please fill out all fields'});
   }

    Company.findOne({"_id": req.body.companyID}, function(error, result) {
        if(error) {
            return next(error);
        }

        else {
            Location.find({'username': {$in: result.members}, 'time': req.body.time}, function(error, results) {
                if(error){
                    return next(error);
                }

                else {
                    res.json(results);
                }


            })

        }
    });


});


/**
 * Add a new member to a company
 *
 * @param companyID {String} The id of a company
 * @param username {String} Username to add
 */
router.post('/api/addMemberToCompany', function(req, res, next) {

  console.log(req.body);

  if(!req.body.companyID || !req.body.username) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  Company.findOne({"_id": req.body.companyID}, function(error, result) {

    // if error finding company
    if(error) {
      console.log("DID NOT FIND");
      console.log(error);
      return next(error);
    }

    // no error finding company
    else {

        // check if the username is a real username
        User.findOne({"username": req.body.username}, function(error, user) {

          // error finding username
          if(error) {
            return next(error);
          }

          // if the username does not exist.
          if(!user) {
            return res.status(400).json({message: "Username does not exist"});
          }

          // if the username does exist.
          else {

              // if the username already is in the company
              if (result.members.indexOf(req.body.username) > -1) {
                  return res.status(400).json({message: 'Username is already in the company.'})
              }

              // if the username is not in the company
              else {

                  // add the username to the members list
                  result.members.push(req.body.username);

                  // save the udpated company
                  result.save(function(error) {

                    // error saving the company
                    if(error) {
                          console.log("DID NOT SAVE");
                          return next(error);
                      }

                      // success!
                      else {
                          return res.status(200).json({message: 'Success'});
                      }
                  });
              }
          }

        });
    }

  })

});

/**
 * Removes a member from a company
 *
 * @param companyID {String} the companyID
 * @param username {String} the username to remove
 */
router.post('/api/removeMemberFromCompany', function(req, res, next) {
   if(!req.body.companyID || !req.body.username) {
       return res.status(400).json({message: 'Please fill out all fields.'});
   }

   Company.findOne({"_id": req.body.companyID}, function(error, result) {
      if(error) {
          return next(error);
      }

      if(!result) {
          return res.status(400).json({message: 'Not a valid company.'});
      }

      var index = result.members.indexOf(req.body.username);

      if(index > -1) {
          result.members.splice(index, 1);

          result.save(function(error) {
              if(error) {
                  return next(error);
              }

              else {
                  return res.status(200).json({message: "success"});
              }
          })
      }

      else {
          return res.status(400).json({message: 'Username not a member in this company'});
      }

   });


});


var getLocationDataForUser = function(username, callback) {
     Location.find({username: username}, function(error, results) {
        if(error) {
            return callback(null);
        }

        else {
            return callback(results);
        }
    })
};

module.exports = router;


