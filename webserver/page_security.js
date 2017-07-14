// This module will handle the security constraints of the pages as express middleware


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

module.exports = {
  security_audit: function(req, res, next){
    // Audit the security of the incoming request.
    // Check the session and it's validity, check if it's associated with a user

    // Maintain a database of pages and their security.

    // This function will also handle the user roles
  },
  build_permissions: function(){
    // This will use a config file (JSON, of course) to apply permissions to
    // files and directories (if static)
    // for now though, just assume any page other than the login page and the index
    // require a logged in user
  }
};
