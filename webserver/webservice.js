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
}

function main(){
  // Design a webserver, with generic and specific handles
  // using expressjs
  var expr_app = express();

  // Use public/ as a directory for pages during development
  expr_app.use(express.static('public'));

  // use static directory as static pages, such as css, images and javascript
  expr_app.use('/static', express.static('static'));

  // Start begin sessioned stuff.

  expr_app.get('/test', function(req, res){
    res.send("<script> alert('hello world!')</script>")
  })

  expr_app.listen(8080, function(){
    console.log("Listening on 8080");
  })

}


STARTUP();
main();
