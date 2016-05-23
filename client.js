require('./../domvm/dist/polyfills.min');
var domvm = require('./../domvm');
var example_app = require('./app');
var kizzy = require('kizzy');
var cache = require('./app/cache');

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
        
        app.cache = cache;
        Object.keys(initData).map(function (k) {
            app.cache.set(k, initData[k]);
        });
        
    
        var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
        app.view = domvm.view(example_app.IsomorphicTestAppView, {app: app, router: router});
        
        router.refresh();
        
        // restoring the scroll position when mounted
        app.scrollPosition = [document.body.scrollLeft, document.body.scrollTop];
        console.log(["scrollPosition", app.scrollPosition]);
        
        app.view.hook("didMount", function () {
            scrollTo.apply(window, app.scrollPosition);
            console.log(["scrollTo", app.scrollPosition]);
        });
        
        document.body.removeChild(document.body.firstChild);
        app.view.mount(document.body);
    }, 2000);
});