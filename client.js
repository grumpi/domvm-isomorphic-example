var domvm = require('./../domvm');
var example_app = require('./app');

var app = null; 

document.addEventListener("DOMContentLoaded", function() {
    
  setTimeout(function () {
    app = new example_app.IsomorphicTestApp();
    
    var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
    app.view = domvm.view(example_app.IsomorphicTestAppView, {app: app, router: router});
    document.body.removeChild(document.body.firstChild);
    app.view.mount(document.body);
 
    router.refresh();

    console.log("Client initialized!");
  }, 3000);
});