const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const querystring = require('querystring');
const crypto = require('crypto');


const accessControl = require('./access.js');


const HTTPSESSION_DB_URL = "mongodb://localhost:27017/pad-testing";

function uid(){return crypto.randomBytes(18).toString("hex");}



module.exports = {
  ValidateSession: function(req, res, next){
    // Handle the session management, as express middleware.
    // this'll attach & read the cookies directly to req res.

    var parsed_cookies = querystring.parse(req.headers.cookie);

    MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
      // This code is to simply check if there's a valid session, and if there
      // isn't, then to redirect the user to a
      var query = {
        session:parsed_cookies['SessionID']
      };

      db.collection("session").find(query).toArray(function(err, result){
        if(err) throw err;
        // if there's a valid session then next()
        if(result.length == 1 && result[0].expiry > Date.now()){
          req.session_info = result[0]
          next();
        } else {
          // Invalid session:
          console.log("[warn] invalid session");
          accessControl.reject_login_attempt(req, res);
        }
      });

      // End of MongoClient.connect block
    });

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
              "session":uid(),
              "start": Date.now(),
              "expiry": Date.now()+ 1000*60*60 // One hour, should be configurable.
            };

            console.log(data_to_insert)

            db.collection("session").insertOne(data_to_insert, (err, result) => {
              if(err) throw err;
              var sessionID = result.ops[0].session;
              // Write the cookie information to the user.
              res.writeHead(303, {
                "Location":"/dashboard",
                "Set-Cookie":"SessionID="+sessionID+';Path=/'});
              //res.redirect("/dashboard");
              res.end("redirecting...");
              // next();

              db.close();
            });

          })

        }

      //next();
      // End of accessControl.user_login block
      })
    });

  },
  EndSession: function (req, res) {
    var parsed_cookies = querystring.parse(req.headers.cookie);

    MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
      // This code is to simply check if there's a valid session, and if there
      // isn't, then to redirect the user to a
      var query = {
        session:parsed_cookies['SessionID']
      };

      db.collection("session").updateOne(query, {"expiry": 0}, function(err, result){
        if(err) throw err;
        // End session and redirect to login page.
        accessControl.reject_login_attempt(req, res);
      });

      // End of MongoClient.connect block
    });
  }
};
