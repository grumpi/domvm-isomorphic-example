var example_app = require('./shared');
var domvm = require('./../domvm');

var app = new example_app.IsomorphicTestApp();
var router = domvm.route(example_app.IsomorphicTestAppRouter, app);

app.view.attach(document.body.firstChild);

app.content = "Now the client has loaded.";
app.view.redraw();

console.log("Client initialized!");