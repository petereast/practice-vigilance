const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient();
const fs = require('fs');

const HTTPSESSION_DB_URL = "mongodb://localhost:27017/pad-testing";


// Loading dashboard skeleton into memory...

var skeletons = {}

function preload_skeletons() {
  // Load skeletons for this module.
  console.log("Loading skeletons for active_pages/dashboard.js");
  fs.readFile('ui/dashboard.skel', function(err, data){
    if(err) throw err;

    skeletons.dashboard = data;
  });
  fs.readFile('ui/dashboard/user_admin.skel', function(err, data){
    if(err) throw err;
    skeletons.dashboardUserAdmin = data;
  });
  fs.readFile('ui/dashboard/group_view.skel', function(err, data){
    if(err) throw err;
    skeletons.dashboardGroupView = data;
  });

  fs.readFile('ui/topmenu.skel', function(err, data){
    skeletons.topmenu = data;
  });
}

preload_skeletons();

module.exports = {
  render: function (req, res) {
    MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
      if(err) throw err;
      db.collection("users").findOne({_id:mongodb.ObjectID(req.session_info.user)}, function (err, user) {
        // Perform string formatting on the skeleton page

        var temp_Admin_card = `  <div class="interface-card admin-card" id="user-admin-controlbox">
            <h2>Users</h2>

          </div>`

        if(user.userInfo.role != "admin"){
          temp_Admin_card = ""
        }

        var preformatted_output = skeletons.dashboard.toString();
        var formatted_output = preformatted_output.replace("{{user.notifications}}", "Notifications")
          .replace("{{user.cards}}", temp_Admin_card)
          .replace("{{page.topmenu}}", skeletons.topmenu.toString().replace("{{user.fullname}}", user.userInfo.name));
        res.send(formatted_output);
      });
    });

  },
  subpages: {
    renderUserAdmin: function (req, res) {
      MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
        if(err) throw err;
        db.collection("users").findOne({_id:mongodb.ObjectID(req.session_info.user)}, function (err, result) {
          // Perform string formatting on the skeleton page

          // Add an 'ungrouped users' section (async!!)

          var preformatted_output = skeletons.dashboardUserAdmin.toString();
          var formatted_output = preformatted_output.replace("{{user.notifications}}", "")
          .replace("{{page.topmenu}}", skeletons.topmenu.toString().replace("{{user.fullname}}", result.userInfo.name));
          res.send(formatted_output);
        });
      });
    },
    renderUserGroupView: function (req, res) {

      var group_url = req.path.split("/")[4];
      MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
        if(err) throw err;
        db.collection("users").findOne({_id:mongodb.ObjectID(req.session_info.user)}, function (err, result) {
          // Perform string formatting on the skeleton page

          var temp_Admin_card = `  <div class="interface-card admin-card" id="user-admin-controlbox">
          <h2>Users</h2>

          </div>`

          var preformatted_output = skeletons.dashboardGroupView.toString();
          var formatted_output = preformatted_output.replace("{{user.notifications}}", "")
          .replace("{{page.topmenu}}", skeletons.topmenu.toString().replace("{{user.fullname}}", result.userInfo.name));
          res.send(formatted_output);
        });
      });
    }
  },
}
