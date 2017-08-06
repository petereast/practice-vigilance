# uauth.coffee
# Unified authentication scripts, should provide a single interface for interacting with the user
# backend.

mongodb = require "mongodb"
MongoClient = mongodb.MongoClient

USER_DATABASE_URL = "mongodb://localhost:27017/pad-testing"

module.exports =
  user: (userSelector, next, options={}) ->
    # Return an object containing all the information that the accessing user
    # is allowed to access - using session information (if present & required)

    # Can select user either by username, by ObjectID or by PublicIdentifier
    # the system will indicate which by the following scheme:
    #   '#' for PublicIdentifier,
    #   '@' for username
    #   '&' for ObjectID
    # None of the characters will be allowed in a username, and if none are present,
    # default to username (@)

    if typeof userSelector is 'string'
      switch userSelector[0]
        when '#'
          query =
            public_identifier: userSelector.substring(1)
        when '@'
          query =
            username: userSelector.substring(1)
        when '&'
          query =
            _id: mongodb.objectID(userSelector.substring(1))
        else
          query =
            username: userSelector

    else
      query =
        _id: userSelector

    
    MongoClient.connect USER_DATABASE_URL, (err, db) ->
      if err then throw err
      db.collection "users"
        .findOne query


    next()

  audit: (userSelector, resource) ->
    # Return a function that is expressjs middleware that determines if a user
    # as access to a particular resource.
    (req, res, next) ->

      next();

  contextAudit: (userSelector, contextSelector) ->
    (req, res, next) ->
      next()


  defineContext: (contextSelector, options) ->
    # register a context in the database
    console.log "Defining a context!"
