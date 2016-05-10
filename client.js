require('./../domvm/dist/polyfills.min');
var domvm = require('./../domvm');
var example_app = require('./app');

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
        
        app.initData = initData;
    
        var router = domvm.route(example_app.IsomorphicTestAppRouter, app);
        app.view = domvm.view(example_app.IsomorphicTestAppView, {app: app, router: router});
        document.body.removeChild(document.body.firstChild);
        app.view.mount(document.body);
 
        router.refresh();

        console.log("Client initialized!");
    }, 2000);
});