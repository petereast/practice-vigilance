var current_section = {}

window.onload = function(){
  var mcq_config_update = function(){
    var current_mcq_config = {}
    // Get the info from the mcq and put it into json data.

  }

  var mcq_config_complete_mcq = function () {
    // Perform validation on mcq data.

    // Compile all the mcq data into a json doc.
    var output = {
      "mcq-title":document.getElementById('mcq_config_title').value,
      "responses":[]
    }

    document.getElementById('mcq_config_response_list').children

    for(var respobj in document.getElementById('mcq_config_response_list').childNodes){
      respobj.innerHTML = "pop"
      console.log(respobj);
    }

  }

  var mcq_config_remove_response = function(e){
    var obj = e.currentTarget;
    obj.parentElement.remove();
  }

  var mcq_config_add_response_fn = function () {
      // Generate a new, empty response object.

      var new_response = document.createElement("li")
      new_response.class = "mcq_config_response_li"

      new_response.appendChild(document.createTextNode("Response Text: "));
      var new_response_input = document.createElement('input');
      new_response_input.class="resptext";
      new_response.appendChild(new_response_input);
      new_response.appendChild(document.createTextNode("Correct answer: "));
      var new_response_correct = document.createElement('input');
      new_response_correct.type = 'checkbox';
      new_response.appendChild(new_response_correct);

      var remove_response = document.createElement("button");
      remove_response.appendChild(document.createTextNode("Remove"))
      remove_response.addEventListener('click',mcq_config_remove_response)
      new_response.appendChild(remove_response);




      document.getElementById('mcq_config_response_list').appendChild(new_response)
  }

  var mcq_config_init = function(){
    // Include code for displaying mcq config - possibly JQuery?
    document.getElementById("mcq_config_add_response").addEventListener("click", mcq_config_add_response_fn);

    document.getElementById('mcq_config_complete').addEventListener('click', mcq_config_complete_mcq)

    mcq_config_add_response_fn();
    mcq_config_add_response_fn();
    mcq_config_add_response_fn();
    mcq_config_add_response_fn();

  }


  var init = function(){

    mcq_config_init();

    current_section.id = "Test Section";

    document.getElementById("section_title_input").addEventListener('keyup', function(){
      var input = document.getElementById("section_title_input").value;
      var output = document.getElementById("section_title_disp");

      output.innerHTML = input;
      current_section.title = input;
    });

    document.getElementById("add_mcq_btn").addEventListener('click', function(){
      alert('click');
    });

  }
init();
}
