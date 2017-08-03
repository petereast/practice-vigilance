// function add_user_manually_init() {
//   document.getElementById("add-users-manually-btn").addEventListener("click", function (ev) {
//     $("#add-user-manually-container").fadeIn(200);
//     $(".modal-shade").fadeIn(200);
//     document.getElementById("add-user-form").reset();
//
//     // Load events for the form
//     document.getElementById("user-full-name").addEventListener("keyup", function (ev) {
//       var current_value = ev.target.value;
//       // Split into first and last name...
//       var names = current_value.split(" ")
//
//       var suggested_uname = names[0].trim().substring(0, 1)
//         .toLowerCase()+names[names.length-1]
//         .trim().toLowerCase();
//
//       // TODO: Add a check to see if the username is already taken, and suggest
//       // an alternative.
//
//       document.getElementById("user-username").value = suggested_uname
//
//       ev.target.parentNode.classList.add("user-input-ok");
//       document.getElementById("user-username").parentNode.classList.add("user-input-ok");
//
//     });
//
//     // match(/\w+@\w+(\.\w)+/)
//
//     document.getElementById("user-email").addEventListener("keyup", function (ev) {
//       if(ev.target.value.match(/\w+@\w+(\.\w)+/)){
//         ev.target.parentNode.classList.remove("user-input-error")
//         ev.target.parentNode.classList.add("user-input-ok")
//       } else{
//         ev.target.parentNode.classList.add("user-input-error")
//         ev.target.parentNode.classList.remove("user-input-ok")
//       }
//     });
//
//     document.getElementById("user-password-confirm").addEventListener("keyup", function (ev) {
//
//       if(ev.target.value ==   document.getElementById("user-password").value){
//         ev.target.parentNode.classList.remove("user-input-error")
//         ev.target.parentNode.classList.add("user-input-ok")
//       } else{
//         ev.target.parentNode.classList.add("user-input-error")
//         ev.target.parentNode.classList.remove("user-input-ok")
//       }
//
//     })
//   });
// }
//
// $(document).ready(function () {
//   add_user_manually_init();
// })
