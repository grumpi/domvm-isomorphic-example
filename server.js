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
    console.log(['serving data for', what]);
    
    console.log(['cookie/csrf', req.cookies['domvm-isomorphic-example-login-cookie'], req.get('X-Requested-With')]);
    
    setTimeout(function () {
        contexts[what]({
            cookies: req.get('Cookie'),
            csrf: req.get('X-Requested-With'),
        }).then(
            function (result) {
                console.log(result);
                res.status(200);
                res.json(result);
                console.log('SPA: SENT!');
            },
            function (error) {
                error.data.json().then(function (body) {
                    console.log(['SPA: ERROR!', error, error.data.status, body]);
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
var resources = require('./resources');

app.post('/api/login/', function (req, res) {
    console.log(['Someone tries to log in', req.body]);
    
    setTimeout(function () {
        if (req.body.password === 'test' && req.body.username === 'test') {
            res.cookie('domvm-isomorphic-example-login-cookie', 'example-session-value', { maxAge: 900000, httpOnly: true });
            res.json({username: 'test', id: 4, csrf: 'csrf-token-value'});
        } else {
            res.status(404);
            res.json({error: "Login failed. Try logging in with username 'test' and password 'test'."});
        }
    }, 2000);
});

app.post('/api/logout/', function (req, res) {
    console.log(['Someone tries to log out', req.cookies]);
    
    setTimeout(function () {
        res.clearCookie('domvm-isomorphic-example-login-cookie');
        res.send('You were logged out');
    }, 2000);
});

app.get('/api/resources/:what/', function (req, res) {
    var what = req.params.what;
    console.log(['API serving ', what]);
    
    console.log(['cookie', req.cookies['domvm-isomorphic-example-login-cookie']]);
    
    if (req.cookies['domvm-isomorphic-example-login-cookie'] !== 'example-session-value') {
        var err = {error: 'No permission to access '+what};
        res.status(403);
        res.json(err);
        console.log(["API: error!", err]);
    } else {
        res.json(resources[what]);
        console.log(['API: sent!', resources[what]]);
    }
});



// SPA server
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



app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
