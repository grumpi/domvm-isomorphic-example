var example_app = require('./shared');
var domvm = require('./../domvm');

var app = null; 

document.addEventListener("DOMContentLoaded", function() {
    
  setTimeout(function () {
    app = new example_app.IsomorphicTestApp();
    
    domvm.route(example_app.IsomorphicTestAppRouter, app);
  
    app.view.attach(document.body.firstChild);
  
    app.content = "Now the client is running.";
    app.view.redraw();

    console.log("Client initialized!");
  }, 3000);
});