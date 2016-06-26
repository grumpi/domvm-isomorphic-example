var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var domvm = require('./../domvm');
var browserify = require('browserify-middleware');
var example_app = require('./app');
var contexts = require('./app/context/contexts');
var compression = require('compression');
var html_escape = require('html-escape');

GLOBAL.window = {};

GLOBAL.history = {};

GLOBAL.location = {
    href: null,
    origin: '',
};

GLOBAL.HTMLElement = function () {};


// SPA server
var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());

app.get('/data/:what/', function (req, res) {
    var what = req.params.what;
    console.log("SPA server begins to serve context data for route '"+what+"'");
    
    console.log(['cookie/csrf', req.cookies['domvm-isomorphic-example-login-cookie'], req.get('X-Requested-With')]);
    
    setTimeout(function () {
        contexts[what]({
            cookies: req.get('Cookie'),
            csrf: req.get('X-Requested-With'),
        }).then(
            function (result) {
                res.status(200);
                res.json(result);
                console.log(['SPA server: sent!', result]);
            },
            function (error) {
                error.data.json().then(function (body) {
                    console.log(['SPA server: error!', error, body]);
                    res.status(error.data.status);
                    res.json(body);
                });
            }
        );
    }, 1000);
});

app.get('/client.js', browserify('./client.js'));

app.get('/favicon.ico', function (req, res) {
    res.status(404).send("Not found");
});
   
// API server
var addApiRoutes = require('./api');
addApiRoutes(app, '/api');

// SPA server prerendering HTML
app.get('/*', function (req, res) {
    console.log("SPA server begins to serve HTML for path '" + req.path + "'");
    console.log(['cookie/csrf', req.cookies['domvm-isomorphic-example-login-cookie'], req.get('X-Requested-With')]);
    
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
  app.viewContextURL = 'http://127.0.0.1:8000/data/';
  app.serverAuth = {
    cookies: req.get('Cookie'),
    csrf: req.get('X-Requested-With'),
  };
  app.data_to_inline = {};
  
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



app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
