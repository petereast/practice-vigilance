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
  render_old: function(req, res){
    // Begin rendering the dashboard page.
    var htmlOutput = `<!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard</title>
          <script type="text/javascript" src="/static/scripts/std.js"></script>
          <script type="text/javascript" src="/static/scripts/dashboard.js"></script>
          <link rel="stylesheet" type="text/css" href="/static/style/master.css"/>
          <link rel="stylesheet" type="text/css" href="/static/style/dashboard.css"/>
        </head>

    `

    // Note that all user relative stuff will be accessed asynchronously and therfore must all happen at once

    MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
      if(err) throw err;
      db.collection("users").findOne({_id:mongodb.ObjectID(req.session_info.user)}, function(err, user){
        if(err) throw err;

        // Just for now:
        htmlOutput += `<body>
        <div class="warning-dialogue-container"><div class="warning-dialogue info"><h1>Woah there!</h1><p>This is still under development</p></div></div>
        <h1>Dashboard!</h2>`;

        htmlOutput +=`
          <div class="user-status-box">{{username}}</div>
        `.replace("{{username}}", user.userInfo.name)

        switch(user.userInfo.role){
          // Use a switch object to represent a user stack.
          case "admin":
            htmlOutput += `
            <div class="controlbox link" id="user-admin-controlbox">
            <h1>User admin</h1>
            <p>Administrative access to the users in the system</p>
            </div>
            `
          case "student":
            // Student stuff goes here

          default:
            htmlOutput += "&copy;2017 Peter East.</body></html>"
            res.send(htmlOutput)

        }


      });
    });
  },
  render: function (req, res) {
    MongoClient.connect(HTTPSESSION_DB_URL, function(err, db){
      if(err) throw err;
      db.collection("users").findOne({_id:mongodb.ObjectID(req.session_info.user)}, function (err, result) {
        // Perform string formatting on the skeleton page

        var temp_Admin_card = `  <div class="interface-card admin-card" id="user-admin-controlbox">
            <h2>Users</h2>

          </div>`

        var preformatted_output = skeletons.dashboard.toString();
        var formatted_output = preformatted_output.replace("{{user.notifications}}", "Notifications")
          .replace("{{user.cards}}", temp_Admin_card)
          .replace("{{page.topmenu}}", skeletons.topmenu.toString().replace("{{user.fullname}}", result.userInfo.name));
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
