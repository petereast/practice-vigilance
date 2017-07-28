var groups = {}

var update_group_list = function () {
  $.ajax("/admin/async/users/groups/listall",{
    success: function (data) {
      if(data["query"] && data.query == "ok"){
        // Empty the current list
        document.getElementById("users-groups-list-display").innerHTML = "";
        // The query was okay!
        var groups = data.result;
        var group_elements = []

        for(var i = 0, group; group = groups[i]; i++){
          console.log(group);
          var current_element = document.createElement("li")
            var title = document.createElement("h2")
            title.appendChild(document.createTextNode(group.name));
          current_element.appendChild(title);
            var member_count = document.createElement("p");
            member_count.appendChild(document.createTextNode(group.memberCount));
          current_element.appendChild(member_count);
            var link = document.createElement("a");
            link.classList.add("users-group-li-btn");
            link.href = "users/groups/"+group.public_id
            link.appendChild(document.createTextNode("Edit Group"))
          current_element.appendChild(link)

          document.getElementById("users-groups-list-display").appendChild(current_element)

        }
        document.getElementById("user-group-list-loading-indicator").style.display = "none"
      }

    },
    contentType: "application/json"
  })
}

window.onload = update_group_list;

setInterval(update_group_list, 1000);
