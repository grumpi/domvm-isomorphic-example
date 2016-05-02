var express = require('express');
var app = express();
var domvm = require('./../domvm');
var browserify = require('browserify-middleware');

var example_app = require('./shared');

GLOBAL.document = {
  title: ''
};

GLOBAL.window = {};

GLOBAL.history = {};

GLOBAL.location = {
    href: null,
    origin: '',
};

GLOBAL.HTMLElement = function () {};

app.get('/client.js', browserify('./client.js'));

app.get('/*', function (req, res) {
  location.href = req.path;
  
  var app = new example_app.IsomorphicTestApp();
  app.content = "This is coming from the server.";
  
  var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
  
  var result = '<!doctype html><html><head></head>'
    + '<body>' 
    + domvm.html(app.view.node) 
    + '</body>'
    + '<script src="/client.js"></script></html>';
  res.send(result);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

