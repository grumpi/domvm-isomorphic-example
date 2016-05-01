var example_app = require('./shared');

var app = new example_app.IsomorphicTestApp();
var router = domvm.route(example_app.IsomorphicTestAppRouter, app);

app.view.attach(document.body);

setTimeout( function () {
    app.content = "Now the client has loaded.";
    console.log("Timeout");
    app.view.redraw();
}, 2000);

console.log("Client initialized!");