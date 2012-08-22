window.addEventListener("load", function()
{
  document.getElementById("save_btn")
          .addEventListener("click", save_options, false);
		  		  
  restore_options();
  
}, false);


// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("color");
  var color = select.children[select.selectedIndex].value;
  localStorage["favorite_color"] = color;
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Opcija snimljena. Idem na glavnu stranicu ...";
  setTimeout(function() {
    status.innerHTML = "";
    window.location.href = 'index.html';
  }, 750);
  
  
}
// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("color");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}
