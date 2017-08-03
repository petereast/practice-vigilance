// Async Admin - handles all the asynchronous JSON requests for the administrative
// stuff

// TODO: Convert this shit into CoffeeScript

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const MONGO_DB_URL = "mongodb://localhost:27017/pad-testing";

console.log("[WARN] Depricated version - please use CoffeeScript version for deployment.")

module.exports = {
  getGroups: function (req, res) {
    // Provide a master function in which all async operations for groups take place.
    // The url will follow this pattern:
    // {server}/admin/async/groups/{groupid}/{action}
    // or {server}/admin/async/groups/new
    var groupid = req.path.split("/")[5];
    var action;
    if(groupid != 'new' && groupid != 'listall' && req.path.split('/').length > 5){
      action = req.path.split('/')[6];
    } else{
      action = groupid;
    }
    MongoClient.connect(MONGO_DB_URL, function (err, db) {
      if(err) throw err;
      switch (action) {
        case "list":
          // Return the json data for the group.
          // provide option to list users *not* in a group. - for groupid 0?
          db.collection("user_group").findOne({public_id:parseInt(groupid)}, function(err, result){
            if(result){
              var output = {"result":result.members}

              res.send(output);

            } else {
              res.send({"Error":"Group not found!"});
            }
          });
          break;
        case "listall":
        // include a group of 'ungrouped' users
          db.collection("user_group").find({}).toArray(function (err, result) {
            if(err) throw err;
            // Remove the _id property of the results
            for(var i = 0, obj; obj = result[i]; i++){
              delete obj._id;
              obj.memberCount = obj.members.length;
              delete obj.members;
            }
            // Information for this group needs to be generated each time
            result.push({"I AM AN EMPTY GROUP":null, "name":"Ungrouped", memberCount:0})

            res.send({"query": "ok", "result":result})
          });
          break;
        default:
        res.send({"Error":"Invalid request"});

      }
    })
  },
  getUser:function (req, res) {
    // Use url encoding to get basic user info requests
    // Use POST to get sensitive user info requests and to update/delete information.

    // Ensure the request is correct and stuff...
    var uid = req.path.split('/')[4]
    if(uid){
      MongoClient.connect(MONGO_DB_URL, function (err, db) {
        if(err) throw err;
        db.collection("users").findOne({public_identifier:uid}, function (err, result) {
            // Sanitize the result for sending output
            delete result._id;
            delete result.password;
            res.send({"query":"ok", "result":result});
        });
      });

    }else{
      res.send({"Error":"Invalid request"});
    }

  }

};
