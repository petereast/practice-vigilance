const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const querystring = require('querystring');
const accessControl = require('./access.js');


const HTTPSESSION_DB_URL = "mongodb://localhost:27017/pad-testing";

module.exports = {
  ValidateSession: function(req, res, next){
    console.log("test");

    // Handle the session management, as express middleware.
    // this'll attach & read the cookies directly to req res.

    var parsed_cookies = querystring.parse(req.headers.cookie);
    console.log("Session:");
    console.log(parsed_cookies);

    console.log(req.path);

    MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
      // This code is to simply check if there's a valid session, and if there
      // isn't, then to redirect the user to a

      var query = {
        _id:""
      }

      db.collection("session").findOne(query, function(err, result){


        // if there's a valid session then next.d
      });

      // End of MongoClient.connect block
    });

    next();
  },
  InitiateSession: function(req, res, next){
    // First check that the user doesn't already have a session

    // Possilby to be implemented as middleware for the /data/begin-session endpoint.
    // the data/begin-session (if there's a successful login)

    //NOTE: This method successfully and reliably gets the data from a post form.

    var databody = '';
    req.on('data', function(data){
      databody+=data;
      if(databody.length > 1e5){
        req.connection.destroy();
      }
    }); // Load the data from the user

    // When the data has been completely transferred
    req.on('end', function(){
      var _POST = querystring.parse(databody);
      console.log(_POST);

      accessControl.user_login(_POST.username, _POST.password, function(allowed){
        // At the current phase, this should be rejected

        if(!allowed){
          // Attach the user's information to the session.
          accessControl.reject_login_attempt(req, res);
        } else{
          // Create a session including this user's ID attached to it

          MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
            if(err) throw err;

            data_to_insert = {
              "user": allowed._id,
              "expiry": 1000*60*60 // One hour, should be configurable.
            };

            db.collection("session").insertOne(data_to_insert, (err, result) => {
              if(err) throw err;
              var sessionID = result.ops[0]._id;
              // Write the cookie information to the user.
              res.writeHead(303, {
                "Location":"/dashboard",
                "Set-Cookie":"SessionID="+sessionID+';Path=/'});
              //res.redirect("/dashboard");
              res.end("redirecting...");
              next();

              db.close();
            });

          })

        }

      //next();
      // End of accessControl.user_login block
      })
    });

  }
};
