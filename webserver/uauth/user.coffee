# User.coffee - an object definition for user based things

module.exports (userDBResult) ->
  # Create a module based on the user's db result
  get: ->
    return userDBResult or something
