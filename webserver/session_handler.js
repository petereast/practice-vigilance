const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const HTTPSESSION_DB_URL = "mongodb://localhost:27017/session";

module.exports = {
  Session: function(req, res, next){
    console.log("test");

    // Handle the session management, as express middleware.
    // this'll attach & read the cookies directly to req res.

    MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
      // Query the database and find if there's a valid session
      // If not, then create a new session
      // Try to keep the number of endpoints to a minimum.
      // make the software R O B U S T !

      // read the req.cookie to find out if there's a valid session
      // yadda yadda yadda

      MongoClient.collection("session", function(err, cursor){

      });

      // End of MongoClient.connect block
    });
  }
};
