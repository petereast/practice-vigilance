
window.onload = function(){
  if(document.getElementById("user-admin-controlbox")){
    document.getElementById("user-admin-controlbox").addEventListener('click', function () {
      location.href = '/admin/users'
    });

  }
  for(var i = 0, m; m=document.getElementsByClassName("modal-shade")[i]; i++){
    console.log(m);
    m.addEventListener("click", function (ev) {
      $(".modal-shade").fadeOut(200);
      $(".modal").fadeOut(200);
    });
  }
}
