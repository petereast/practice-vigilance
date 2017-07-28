// A standard script to be sent to all the pages.

// Add JQuery listeners for showing and hiding the top menu

$(document).ready(function () {
  $("#top-nav-menu-user-btn").click(function () {
    $("#topmenu").animate({"top":"0px"}, 200);
    $("#topmenu-shade").fadeIn(200);
  });
  document.addEventListener("click", function(e){
    if(e.clientY > 350){
      $("#topmenu-shade").fadeOut(200);
      $("#topmenu").animate({"top":"-300px"}, 200);
    }
  });

  $("#top-nav-menu-dashboard-btn").click(function () {
    location.href = '/dashboard'
  });

  $("#top-nav-menu-assessments-btn").click(function () {
    location.href = '/assessments'
  });
  $("#top-nav-menu-timesheets-btn").click(function () {
    location.href = '/timesheets'
  });
  $("#logout-btn").click(function(){
    location.href = '/data/end-session'
  });
})
