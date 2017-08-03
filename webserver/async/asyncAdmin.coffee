# Async admin - asynchronous

mongodb = require 'mongodb'
MongoClient = mongodb.MongoClient

MONGO_DB_URL = "mongodb://localhost:27017/pad-testing"


module.exports =
  getGroups: (req, res) ->
    groupid = (req.path.split '/')[5];

    # This expression needs work
    if groupid isnt 'new' and groupid isnt 'listall' and (req.path.split '/').length > 5
      action = (req.path.split '/')[6]
    else
      action = groupid

    MongoClient.connect MONGO_DB_URL, (err, db) ->
      if err then throw err;
      # Add a switch statement
