require('./../domvm/dist/polyfills.min');
var domvm = require('./../domvm');
var example_app = require('./app');
var kizzy = require('kizzy');

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
    console.log(['I discovered the following data:', initData]);
  
    setTimeout(function () {
        app = new example_app.IsomorphicTestApp();
        
        var cache = kizzy('request-cache');
        Object.keys(initData).map(function (k) {
            cache.set(k, initData[k]);
            console.log(['set cache', k, initData[k], cache.get(k)]);
        });
        
    
        var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
        app.view = domvm.view(example_app.IsomorphicTestAppView, {app: app, router: router});
        document.body.removeChild(document.body.firstChild);
        app.view.mount(document.body);
 
        router.refresh();
    }, 2000);
});