var express = require('express');
var app = express();
var domvm = require('./../domvm');
var browserify = require('browserify-middleware');
var example_app = require('./app');

GLOBAL.window = {};

GLOBAL.history = {};

GLOBAL.location = {
    href: null,
    origin: '',
};

GLOBAL.HTMLElement = function () {};

app.get('/api', function (req, res) {
   res.json([
            {id: 2, value: 'Herbert'},
            {id: 3, value: 'Susan'},
            {id: 42, value: 'Peter'},
            {id: 42, value: 'Greg'},
            {id: 42, value: 'Hans'},
            {id: 42, value: 'Janine'},
            {id: 42, value: 'Lisa'},
            {id: 42, value: 'Max'},
            ]);
});

app.get('/client.js', browserify('./client.js'));

app.get('/*', function (req, res) {
  location.href = req.path;
  
  var app = new example_app.IsomorphicTestApp();
  app.server_rendered = true;
  
  var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
  
  if (router.location().name) {
    app.context = example_app.IsomorphicTestAppRoutes[router.location().name].context(router, app);
  }
  app.view = domvm.view(example_app.IsomorphicTestAppView, {app: app, router: router});
  
  var result = '<!doctype html><html>'
    + '<head>'
    + '<title>'+ app.context.title +'</title>'
    + '</head>'
    + '<body>' 
    + domvm.html(app.view.node) 
    + '<script src="/client.js"></script>'
    + '</body>'
    + '</html>';
  res.send(result);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

