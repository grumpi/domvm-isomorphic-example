var domvm = require('./../domvm');
var example_app = require('./shared');

var app = null; 

document.addEventListener("DOMContentLoaded", function() {
    
  setTimeout(function () {
    app = new example_app.IsomorphicTestApp();
    
    var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
    app.view.attach(document.body.firstChild);
  
    app.content("Now the client is running.");
    router.refresh();

    console.log("Client initialized!");
  }, 3000);
});