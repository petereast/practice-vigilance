# webservice.coffee

SERVER_VERSION =
  major: 0,
  minor: 1,
  codename: "Test",
  status: "ok - incomplete",
  system_name: "webservice (coffee v0.1)"

https = require 'https'
http = require 'http'
mongodb = require 'mongodb'
url = require 'url'
fs = require 'fs'
express = require 'express'

sessionHandler = require './session_handler.js'
accessControl = require './access.js'
asyncAdmin = require './async/asyncAdmin.js'

dashboardRenderer = require './active_pages/dashboard.js'

MongoClient = mongodb.MongoClient

MONGO_LOG_SERVER_URL = "mongodb://localhost:27017/log"

startup = (ver) ->
  MongoClient.connect MONGO_LOG_SERVER_URL, (err, db) ->
    if err then throw err

    d =
      time: Date.now(),
      version: ver

    db.collection "startup"
      .insertOne d, (err, res) ->
        if err then throw err
        db.close()

main = ->
  expressApp = express()

  # Implement static content.
  expressApp.use express.static 'public'
  expressApp.use '/static', express.static 'static'

  # Handle signon requests requests
  expressApp.use '/data/begin-session', sessionHandler.InitiateSession
  expressApp.use '/data/end-session', sessionHandler.EndSession

  # Everything beyond this point in the stack requires a valid session
  expressApp.use sessionHandler.ValidateSession

  # Dashboard endpoint
  expressApp.get "/dashboard", dashboardRenderer.render

  # Add administrative stuff to dashboard
  #  Require admin priviliges
  expressApp.use '/admin*', accessControl.controlLevel.admin

  #  Admin subpages
  expressApp.get '/admin/users', dashboardRenderer.subpages.renderUserAdmin
  expressApp.get '/admin/users/groups/*', dashboardRenderer.subpages.renderUserGroupView

  # Add async stuff for admin tools
  expressApp.get '/admin/async/users/groups/*', asyncAdmin.getGroups

  # TODO: Implement a separate function for async group data input

  # TODO: Implement an async function for recieving new user data
  expressApp.post '/admin/async/user/add', (req, res) ->
    res.send "OK :)"
  expressApp.get '/admin/async/user/*', asyncAdmin.getUser
  # TODO: Implement a counterpart for this function for a background worker


  expressApp.get '/api/version', (req, res) ->
    ct = "Content-Type": "application/json"
    res.writeHead 200, ct
    res.end JSON.stringify SERVER_VERSION

  # TODO: Add https support
  expressApp.listen 8080, ->
    console.log "Listening on port 8080"

  startup SERVER_VERSION
  undefined

main()
