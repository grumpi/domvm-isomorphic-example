var express = require('express');
var app = express();
var domvm = require('./../domvm');
var browserify = require('browserify-middleware');
var example_app = require('./app');
var resources = require('./resources');
var compression = require('compression');
var html_escape = require('html-escape');

GLOBAL.window = {};

GLOBAL.history = {};

GLOBAL.location = {
    href: null,
    origin: '',
};

GLOBAL.HTMLElement = function () {};

app.use(compression());

app.get('/api/:what/', function (req, res) {
    var what = req.params.what;
    console.log(['serving API', what]);
    res.json(resources[what]);
});

app.get('/client.js', browserify('./client.js'));

app.get('/favicon.ico', function (req, res) {
    res.status(404).send("Not found");
});
    
app.get('/*', function (req, res) {
    console.log(['serving', req.path]);
    
    function render(app, res) {
        app.view = domvm.view(example_app.IsomorphicTestAppView, {app: app, router: router});
    
        var result = '<!doctype html><html>'
        + '<head>'
        + '<title>'+ app.context.title +'</title>'
        + '</head>'
        + '<body>' 
        + domvm.html(app.view.node) 
        + '<script id="resources" type="application/json">' + html_escape(JSON.stringify(app.data_to_inline)) + "</script>"
        + '<script src="/client.js"></script>'
        + '</body>'
        + '</html>';
        res.send(result);
    }
    
  location.href = req.path;
  
  var app = new example_app.IsomorphicTestApp();
  app.data_to_inline = {};
  
  app.ready = function () {
      render(app, res);
  }
  
  var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
  
  if (router.location().name) {
    app.context = example_app.IsomorphicTestAppRoutes[router.location().name].context(router, app);
    if (app.context.ready) {
        app.context.ready.then(function () {
            render(app, res); 
        });
    } else {
        render(app, res);    
    }
  } else {
    render(app, res);
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


