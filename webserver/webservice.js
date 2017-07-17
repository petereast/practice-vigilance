//javascript

const SERVER_VERSION = {
  major: 0,
  minor: 0,
  codename: "test",
  status: "Not started",
  system_name: "webservice"
}

const http = require('http');
const mongodb = require('mongodb');
const url = require('url');
const fs = require('fs');
const express = require('express');
const session_handler = require('./session_handler.js');
const accessControl = require('./access.js');

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

  // Use public/ as a directory for pages during development
  expr_app.use(express.static('public'));

  // use static directory as static pages, such as css, images and javascript
  expr_app.use('/static', express.static('static'));

  // Handle logins (start point of a session)

  // Maybe just use the middleware to handle the login process
  expr_app.use('/data/begin-session', session_handler.InitiateSession)
  //
  // expr_app.post("/data/begin-session", function(req, res){
  //   //res.send("login attempt with" + req.header)
  // })

  // Start begin sessioned stuff.

  expr_app.get('/test', function(req, res){
    res.send("<script> alert('hello world!')</script>")
  });

  // Everything on the stack below this point requires a valid session.

  expr_app.use(session_handler.ValidateSession)

  expr_app.get('/dashboard', dashboardRenderer.render);

  expr_app.listen(8080, function(){
    console.log("Listening on 8080");
  })

}


STARTUP();
