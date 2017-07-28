//javascript

const SERVER_VERSION = {
  major: 0,
  minor: 0,
  codename: "test",
  status: "Not complete",
  system_name: "webservice"
}

const http = require('http');
const https = require('https');
const mongodb = require('mongodb');
const url = require('url');
const fs = require('fs');
const express = require('express');
const session_handler = require('./session_handler.js');
const accessControl = require('./access.js');
const asyncAdmin = require('./async/asyncAdmin.js');

// Load active elements

const dashboardRenderer = require('./active_pages/dashboard.js');

var MongoClient = mongodb.MongoClient;

const MONGO_LOG_SERVER_URL = "mongodb://localhost:27017/log";

function STARTUP(){
  MongoClient.connect(MONGO_LOG_SERVER_URL, function(err, db){
    if(err) throw err;

    var d = {
      time: Date.now(),
      version: SERVER_VERSION
    }

    db.collection("startup").insertOne(d, function(err, res){
      if(err) throw err;
      db.close();
    })
  });
  main();
}

function main(){
  // Design a webserver, with generic and specific handles
  // using expressjs

  // Add a testing user
  accessControl.add_user();

  var expr_app = express();

  // Use public/ as a directory for standard, dumb pages
  expr_app.use(express.static('public'));

  // use static directory as static pages, such as css, images and javascript
  // TODO: Write code for an in memory cache of these resources.
  expr_app.use('/static', express.static('static'));

  // Handle logins (start point of a session)

  // Maybe just use the middleware to handle the login process
  expr_app.use('/data/begin-session', session_handler.InitiateSession)
  expr_app.use('/data/end-session', session_handler.EndSession)
  //
  // expr_app.post("/data/begin-session", function(req, res){
  //   //res.send("login attempt with" + req.header)
  // })

  // Start begin sessioned stuff.
  // Everything on the stack below this point requires a valid session.

  expr_app.use(session_handler.ValidateSession)

  expr_app.get('/dashboard', dashboardRenderer.render);


  expr_app.use("/admin*", accessControl.controlLevel.admin)
  expr_app.get('/admin/users', dashboardRenderer.subpages.renderUserAdmin);
  expr_app.get('/admin/users/groups/*', dashboardRenderer.subpages.renderUserGroupView);

  // Include code to handle async admin requests (listing users in a group etc.)
  // This next block of code will only output JSON encoded data.
  expr_app.get("/admin/async/users/groups/*", asyncAdmin.get_groups)

  // TODO: Implement a separate function for async group data input.
  //expr_app.post("/admin/async/users/groups/*", asyncAdmin.groups)

  // Define an async path for handling user info requests (admin)
  expr_app.get("/admin/async/user/*", asyncAdmin.get_user)


  // End of the json bit
  expr_app.get('/api', function(req, res){
    res.send("API Not operational!");
  });

  expr_app.get("/api/version", function(req, res){
    res.writeHead(200, {"Content-Type":"appliaction/json"});
    res.end(JSON.stringify(SERVER_VERSION));
  });
  // TODO: Setup appliaction to work using https
  expr_app.listen(8080, function(){
    console.log("Listening on 8080");
  })

}


STARTUP();
