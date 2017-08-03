var global_groups = {}
var add_user_form_data = {}

var update_group_list = function () {
  $.ajax("/admin/async/users/groups/listall",{
    success: function (data) {
      if(data["query"] && data.query == "ok"){
        // Empty the current list
        document.getElementById("users-groups-list-display").innerHTML = "";
        // The query was okay!
        var groups = data.result;
        global_groups = groups
        var group_elements = []

        for(var i = 0, group; group = groups[i]; i++){
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
function add_user_manually_init() {
  const formToJSON = elements => [].reduce.call(elements, (data, element) => {

  if(!data[element.name]){
    data[element.name] = element.value;
  } else if (typeof(data[element.name]) == "string"){
    var tmp = data[element.name]
    data[element.name] = [tmp]
    data[element.name].push(element.value)
  } else if (typeof(data[element.name]) == "object"){
    data[element.name].push(element.value)
  }
  return data;

  }, {});

  document.getElementById("add-user-form").addEventListener("submit", function (ev) {
    ev.preventDefault();

    document.getElementById("submit-btn").classList.add("user-input-ok")
    // Get form data as JSON
    var data = formToJSON(document.getElementById("add-user-form"))
    $.ajax("/admin/async/user/add",{
      contentType: "application/json",
      dataType: "json",
      "data":JSON.stringify(data),
      method: "POST",
      success: function (ev) {
        $("#add-user-form").html("<h1>Success!</h1>")
        setTimeout(2000, function () {
          $("#add-user-manually-container").fadeOut(200);
          $(".modal-shade").fadeOut(200);
        })
      }
    });
  })

  document.getElementById("add-users-manually-btn").addEventListener("click", function (ev) {
    $("#add-user-manually-container").fadeIn(200);
    $(".modal-shade").fadeIn(200);
    document.getElementById("add-user-form").reset();

    // Load events for the form
    document.getElementById("user-full-name").addEventListener("keyup", function (ev) {
      var current_value = ev.target.value;
      // Split into first and last name...
      var names = current_value.split(" ")

      var suggested_uname = names[0].trim().substring(0, 1)
        .toLowerCase()+names[names.length-1]
        .trim().toLowerCase();

      // TODO: Add a check to see if the username is already taken, and suggest
      // an alternative.

      document.getElementById("user-username").value = suggested_uname

      add_user_form_data.user_fullname = current_value;

      ev.target.parentNode.classList.add("user-input-ok");
      document.getElementById("user-username").parentNode.classList.add("user-input-ok");

    });

    // match(/\w+@\w+(\.\w)+/)

    document.getElementById("user-email").addEventListener("keyup", function (ev) {
      if(ev.target.value.match(/\w+@\w+(\.\w)+/)){
        ev.target.parentNode.classList.remove("user-input-error")
        ev.target.parentNode.classList.add("user-input-ok")
      } else{
        ev.target.parentNode.classList.add("user-input-error")
        ev.target.parentNode.classList.remove("user-input-ok")
      }
      add_user_form_data.email = {"v":ev.target.value, "valid":ev.target.value.match(/\w+@\w+(\.\w)+/)}
    });

    document.getElementById("user-password").addEventListener("keyup", function (ev) {
      add_user_form_data.pw = ev.target.value

    })

    document.getElementById("user-password-confirm").addEventListener("keyup", function (ev) {

      if(ev.target.value == document.getElementById("user-password").value){
        ev.target.parentNode.classList.remove("user-input-error")
        ev.target.parentNode.classList.add("user-input-ok")
      } else{
        ev.target.parentNode.classList.add("user-input-error")
        ev.target.parentNode.classList.remove("user-input-ok")
      }

      add_user_form_data.pw_confirm = {"v":ev.target.value, "valid":ev.target.value == document.getElementById("user-password").value}

    });

    document.getElementById("user-add-group").addEventListener("keyup", function (ev) {
      var add_group_label = function (text) {

        var hidden_element = document.createElement("input");
        hidden_element.type = "hidden"
        hidden_element.name = "group_item"
        hidden_element.value = "groupname:" + text
        hidden_element.id = "group-hidden-"+text

        var group_container = document.createElement("span")
        group_container.classList.add("group-label");
        group_container.id = "group-container-"+text
        group_container.appendChild(document.createTextNode(text))
        group_container.appendChild(hidden_element)
        group_container.addEventListener("dblclick", function (ev) {
          // Remove the group
          ev.target.parentNode.parentNode.removeChild(ocument.getElementById(ev.target.id.replace("container", "hidden")))
          ev.target.parentNode.removeChild(ev.target);
        });
        ev.target.previousSibling.appendChild(group_container)
        add_user_form_data.groups.push(text);

        // Add a readable form element for this group, so the information is
        // can be handled more easily by the server, rather than by the client



      }
      if(!add_user_form_data.groups){
        add_user_form_data.groups = [];
      }
      if(ev.key == ','){
        ev.preventDefault();
        var current_group = ev.target.value.trim().substring(0, ev.target.value.trim().length-1);
        ev.target.value = "";

        add_group_label(current_group)

      } else if (ev.target.value.length > 0){
        var results = []
        document.getElementById("user-groups-search-result-list").innerHTML = "";
        for(var i = 0, r; r = global_groups[i]; i++){
          if(r.name.substring(0, ev.target.value.length).toLowerCase() == ev.target.value.toLowerCase()){
            var result_display = document.createElement("span")
            result_display.classList.add("user-group-search-result")
            result_display.appendChild(document.createTextNode(r.name))
            result_display.addEventListener("click", function (evt) {
              add_group_label(evt.target.innerHTML)
              ev.target.value = "";
              document.getElementById("user-groups-search-result-list").innerHTML = ""
            });
            document.getElementById("user-groups-search-result-list").appendChild(result_display)
          }
        }
      } else if (ev.key == "Backspace" && ev.target.value.length == 0 ){
        ev.target.previousSibling.removeChild(ev.target.previousSibling.lastChild)
      } else {
        document.getElementById("user-groups-search-result-list").innerHTML = "";
      }
    });
  });
}

$(document).ready(function () {
  add_user_manually_init();
  update_group_list();
})

setInterval(update_group_list, 1000);
