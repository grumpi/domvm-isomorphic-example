var w = require('./widgets');
var server_rendered = require('./server-or-client');

function IsomorphicTestAppView(vm, deps) {
    return function() {
        var route = deps.router.location();
        var result;
        
        if (deps.app.context) {
        
            switch (route.name) {
                case 'home':
                    result = ["div", 
                        ['div', deps.app.context.data()],
                        ["a", {href: deps.router.href("contact_list", {})}, 
                        "Contact List"]];
                    break;
                case 'contact_list':
                    result = ["div", 
                        [w.ContactListWidget, {data: deps.app.context.data }],
                        ["br"], 
                        ["a", {href: deps.router.href("home", {})}, 
                        "Go home now"]];
                    break;
                default:
                    result = ["span", "It looks like you are lost. Let's ", ["a", {href: deps.router.href("home", {})}, 
                        "go home"], "."];
                    break;
            }
        }
        else {
            result = ['span', 'The app is starting up...'];
        }
        
        var txt = server_rendered ? "Server" : "Client";
        
        console.log(deps.app.errorMessage());
        
        return ['div#domvm', {class: server_rendered ? '.server' : '.client'}, 
            ["div", txt],
            ["div", deps.app.errorMessage()],
            ['br'], ['br'],
            result];
    };
}

module.exports = {
    IsomorphicTestAppView: IsomorphicTestAppView,
};