# Async admin - asynchronous

mongodb = require 'mongodb'
MongoClient = mongodb.MongoClient

MONGO_DB_URL = "mongodb://localhost:27017/pad-testing"


# These functions are to be replaced/refactored to be part of the
# uauth.coffee module.
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
      switch action
        when "list"
          db.collection "user_group"
            .findOne {public_id:parseInt groupid}, (err, result) ->
              if result
                res.send {"result":result.members}
              else
                res.send {"Error":"Group not found!"}
              db.close()

        when "listall"
          db.collection "user_group"
            .find {}
            .toArray (err, result) ->
              if err then throw err

              # For each group, remove unneeded data
              for item in result
                delete item._id
                item.memberCount = item.members.length
                delete item.members

              # Append another empty placeholder group to the end.
              result.push {"I AM AN EMPTY GROUP":null, "name":"Ungrouped", memberCount:0}

              res.send {"query":"ok", "result":result}
              db.close()

        else
          res.send {"Error": "invalid request"}
          db.close();


  getUser: (req, res) ->

    # TODO: This needs to be validated.
    uid = (req.path.split '/')[4]

    if uid
      MongoClient.connect MONGO_DB_URL, (err, db) ->
        if err then throw err
        db.collection "users"
          .findOne {public_identifier:uid}, (err, result) ->
            # Sanitize the output
            if result
              delete result._id;
              delete result.password

              res.send {"query":"ok", "result":result}
            else
              res.send {"Error":"Invalid user"}
            db.close();
    else
      res.send {"Error":"Invalid request"}
