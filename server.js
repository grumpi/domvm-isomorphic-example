global.document = null;

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
global.domvm = require('./../domvm/dist/full/domvm.full.js');
var browserify = require('browserify-middleware');
var example_app = require('./app');
var contexts = require('./app/context/contexts');
var compression = require('compression');
var html_escape = require('html-escape');
var http = require('./app/http');
var auth = require('./app/auth/server');

global.window = {};

global.history = {};

global.location = {
    href: null,
    origin: '',
};

var API_URL = 'http://127.0.0.1:8000/api/';
var SPA_URL = 'http://127.0.0.1:8000/';


var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());

app.get('/client.js', browserify('./client.js'));

app.get('/favicon.ico', function (req, res) {
    res.status(404).send("Not found");
});
   
// API server
var addApiRoutes = require('./api');
addApiRoutes(app, '/api');


// SPA server serving data for view contexts
app.get('/data/:what/', function (req, res) {
    var what = req.params.what;
    console.log("SPA server begins to serve context data for route '"+what+"'");

    var app = new example_app.IsomorphicTestApp();
    app.http = http({
      apiURL: API_URL,
      spaServerURL: SPA_URL
    });
    
    app.auth = auth(app, req);
    
    contexts[what](app, req.query).then(
        function (result) {
            res.status(200);
            res.json(result);
            console.log(["SPA server: sent!", result]);
        },
        function (error) {
            console.log(["ERROR!", error]);

            if (error.response) {
                res.status(error.response.status);
                res.json(error.response.statusText);
            } else {
                res.status(500);
                res.json(error.message);
            }
        }
    );
});

// SPA server prerendering HTML
app.get('/*', function (req, res) {
    console.log("SPA server begins to serve HTML for path '" + req.path + "'");
    console.log(['cookie/csrf', req.cookies['domvm-isomorphic-example-login-cookie'], req.get('X-Requested-With')]);
    
    function render(app, res) {
        console.log("Trying to render HTML!");
        try {
            app.view = domvm.createView(example_app.IsomorphicTestAppView, {app: app, router: router});
        
            var result = '<!doctype html><html>'
            + '<head>'
            + '<title>'+ app.context.title +'</title>'
            + '</head>'
            + '<body>' 
            + app.view.html()
            + '<script id="resources" type="application/json">' + html_escape(JSON.stringify(app.data_to_inline)) + "</script>"
            + '<script src="/client.js"></script>'
            + '</body>'
            + '</html>';
            
            console.log('HTML sent!');
            
            res.send(result);
        } catch (e) {
            var result = '<!doctype html><html>'
            + '<head>'
            + '<title>Here be Dragons</title>'
            + '</head>'
            + '<body>' 
            + '<div>'
            + '<h1>Something went horribly wrong! The server was unable to render the page.</h1>'
            + e.message
            + '</div>'
            + '<script id="resources" type="application/json">' + html_escape(JSON.stringify(app.data_to_inline)) + "</script>"
            + '<script src="/client.js"></script>'
            + '</body>'
            + '</html>';
            
            console.log("There was an error rendering!");
            
            res.status(500).send(result);
        }
    }
    
    location.href = req.path;
  
    var app = new example_app.IsomorphicTestApp();
    app.http = http({
        apiURL: API_URL,
        spaServerURL: SPA_URL
    });
    app.auth = auth(app, req);
    
    app.data_to_inline = {};
  
    var router = domvm.createRouter(example_app.IsomorphicTestAppRouter, app);
  
    app.auth.init().then(function () {
        if (router.location().name) {
            app.context = example_app.IsomorphicTestAppRoutes[router.location().name].context(router, app);
            if (typeof app.context.ready !== 'undefined') {
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
});



app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
