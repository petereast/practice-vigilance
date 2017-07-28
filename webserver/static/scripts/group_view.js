// Handle the js events for the group viewer

var group_information = {}

var global_users = []

var showUser = function (ev) {
  // Get the current user
  var selected_user = global_users[parseInt(ev.target.id.substr(9))]
  console.log(selected_user);
  // Set all the information
  document.getElementById("detail-fullname").innerHTML = selected_user.userInfo.name;

  // Display the information
  $("#group-users-list-container").animate({
    "left":"-450px"},300)
  $("#user-detail-view").fadeIn(300);

  $("#close-user-detail-view").click(function () {
    $("#group-users-list-container").animate({
      "left":"0px"},300)
      $("#user-detail-view").fadeOut(300);

  });
}

var removeUser = function () {

}

var display_user_data = function () {
  // Sort the array of global users alphabetically

  global_users.sort(function (a, b) {
    if(a.userInfo.name > b.userInfo.name){
      return 1;
    } else if (a.userInfo.name < b.userInfo.name) {
      return -1;
    } else {
      return 0;
    }
  });

  var container_element = document.getElementById("group-users-list-display");

  container_element.innerHTML = ""

  for(var i = 0, u; u = global_users[i]; i++){
    var current_element = document.createElement("li");
      var u_title = document.createElement("h3");
      u_title.appendChild(document.createTextNode(u.userInfo.name));
    current_element.appendChild(u_title)
      var view_user_btn = document.createElement("button")
      view_user_btn.classList.add("users-group-li-btn")
      view_user_btn.id = "view-btn-"+i;
      view_user_btn.addEventListener("click", showUser)
      view_user_btn.appendChild(document.createTextNode("View/Edit User"))
    current_element.appendChild(view_user_btn)
      var remove_user_btn = document.createElement("button")
      remove_user_btn.classList.add("users-group-li-btn")
      remove_user_btn.id = "remove-btn-"+i;
      remove_user_btn.addEventListener("click", removeUser)
      remove_user_btn.appendChild(document.createTextNode("Remove User"))
    current_element.appendChild(remove_user_btn)
    container_element.appendChild(current_element)
  }
}

var update_group_user_list = function () {
  $.ajax(location.href.replace("admin","admin/async")+'/list', {
    success: function (data) {
      if(!data["Error"]){
        group_information = data;
        // Go through each uder listed and request information about them from the
        // server
        console.log(group_information)
        var total_users = group_information.result.length
        for(var i = 0, user; user = group_information.result[i]; i++){
          // Use the result to fetch
          $.ajax("/admin/async/user/"+user, {
            contentType:"application/json",
            success: function (eata) {
              if(eata.query == "ok"){
                global_users.push(eata.result)
              }

              if(i == total_users){
                console.log("display update")
                display_user_data()
              }
            }
          })
        }
      }
    },
    contentType: "application/json"
  })
}


window.onload = update_group_user_list
