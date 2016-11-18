domvm = require('./../domvm/dist/small/domvm.small.js');
var example_app = require('./app');
var kizzy = require('kizzy');
var cache = require('./app/cache');
var http = require('./app/http');
var auth = require('./app/auth/browser');

var app = null; 

document.addEventListener("DOMContentLoaded", function() {
    function html_unescape(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
    }
    var dataElement = document.getElementById('resources');
    var jsonText = dataElement.textContent || dataElement.innerText;
    var initData = JSON.parse(html_unescape(jsonText));
    console.log(['I discovered the following data dumped by the server into the HTML document:', initData]);
  
    setTimeout(function () {
        app = new example_app.IsomorphicTestApp();
        
        /*
        app.viewContextURL = 'http://127.0.0.1:8000/data/';
        app.loginURL = 'http://127.0.0.1:8000/api/login/';
        app.logoutURL = 'http://127.0.0.1:8000/api/logout/';
        app.whoAmIURL = 'http://127.0.0.1:8000/api/who-am-i/';
        */
        
        app.http = http({
          spaServerURL: 'http://127.0.0.1:8000/',
          apiURL: 'http://127.0.0.1:8000/api/',
        });

        app.auth = auth(app);
        
        app.cache = cache;
        Object.keys(initData).map(function (k) {
            app.cache.set(k, initData[k]);
        });
    
        var router = domvm.createRouter(example_app.IsomorphicTestAppRouter, app);
        app.router = router;
        app.view = domvm.createView(example_app.IsomorphicTestAppView, {app: app, router: router});
        router.refresh();
        
        app.view.hook('didRedraw', function (x) {
            console.log(['domvm did a redraw', x]);
        });
        
        // to keep the scroll position when mounted, all I need to do is make sure I have all the data needed to render the page as close to the server-rendered version as possible, at least this seems to work on Chrome
        app.auth.init().then(function () {
            app.context.ready.then(function () {
                console.log("Mounting the client now");
                document.body.removeChild(document.body.firstChild);
                app.view.mount(document.body); 
                app.view.redraw();
            });
        });
        
        window.criticalError = false;
        
        window.onerror = function(message, url, lineNumber) {
            if (!window.criticalError) {
                app.globalErrorMessage = "A critical error just happened. It's not your fault. I'm sorry it happened. If other things are broken now, it's very likely due to this error. Sometimes, other parts of the app work fine. Sometimes not. Work on fixing the problem is likely already in progress.";
                app.view.redraw();
                window.criticalError = true;
                return false;
            } else {
                return true;
            }
        }
        
    }, 2000);
});