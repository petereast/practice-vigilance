// This module will handle the security constraints of the pages as express middleware


const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const crypto = require('crypto');

const MONGO_DB_URL = "mongodb://localhost:27017/pad-testing";

module.exports = {
  security_audit: function(req, res, next){
    // Audit the security of the incoming request.
    // basically check if the user can access the page or Not

    var accessAllowed = false;

    if(accessAllowed){
      next();
    } else{
      // Send a rejection message. (and maybe redirect the user to a login page if appropriate)
    }

    // Maintain a database of pages and their security.

    // This function will also handle the user roles
  },
  build_permissions: function(){
    // This will use a config file (JSON, of course) to apply permissions to
    // files and directories (if static)
    // for now though, just assume any page other than the login page and the index
    // require a logged in user
  },
  user_login: function(username, password, next){
    // If the login attempt is successful, next is called with information about the
    // user, if not, next is called with either a false or an undefined value.

    // Generate a hash of the password
    var hash = crypto.createHash('sha256');
    hash.update(password);
    var hashedPassword = hash.digest('base64');
    console.log(hashedPassword);

    query ={"username": username};


    // Begin username & password database lookup
    MongoClient.connect(MONGO_DB_URL, function(err, db){
      if(err) throw err;
      db.collection("users").findOne(query, function(err, result){
        if(err) throw err;

        if(result && result.password == hashedPassword){
          next(result);
        } else{
          next(false)
        }
      });
    });

    // End of username & Password lookup


    //next(true);

  },
  reject_login_attempt: function (req, res, next) {
    // Redirect the user to the login page, with a message telling them that
    // they stoopid
    res.send("Your login attempt has been rejected :(<script>location.href='../login.html';</script>");
  },
  add_user: function(){
    console.log("function to add user");
    // TODO: I need to provision the functionality to add many users at once.

    // NOTE: The following code is debug code to add a single user into the database
    // for testing purposes.
    // Users database structure:
    // User: {
    //  _id:                      - Used to refer to this user
    //  Username: kjebssfekjfs,   - (uniquely) used to log into the system
    //  PasswordHash: {hash},     - A securely hashed version of the user's password
    //  UserInfo:{
    //    role: Student,          - Used to determine the layout of the dashboard
    //    name: 'peter east',
    //    email: something@somewhere,
    //    contact_details: {}
    //  }
    //}
    MongoClient.connect(MONGO_DB_URL, function(err, db){
      if(err) throw err;

      var example_user = {
        username: "peter",
        password: "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=", // 1234
        userInfo: {
          role: "admin",
          name: "Peter East",
          email: "peter.east@peter.east.com",
          contact_details: {}
        }
      }

      db.collection("users").insertOne(example_user, function(err, result){
        if(err) throw err;
        db.close();
      })
    });
  },
  batch_add_users: function(){
    // Find some users and add them to the database
  }
};
