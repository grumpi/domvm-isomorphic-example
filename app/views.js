var w = require('./widgets');
var server_rendered = require('./server-or-client');

function IsomorphicTestAppView(vm, deps) {
    return function() {
        var route = deps.router.location();
        var result;
        
        switch (route.name) {
            case 'home':
                result = ["div", 
                    ['div', deps.app.context.data ? deps.app.context.data() : "Loading..."],
                    ['br'],
                    ["a", {href: deps.router.href("contact_list", {})}, 
                    "Contact List"],
                    ['br'],
                    ['br'],
                    ["a", {href: deps.router.href("login", {})}, 
                    "Login"]];
                break;
            case 'contact_list':
                result = ["div", 
                    [w.ContactListWidget, {data: deps.app.context.data, query: deps.app.context.query }],
                    ["br"], 
                    ["a", {href: deps.router.href("home", {})}, 
                    "Go home now"]];
                break;
            case 'login':
                result = ["div",
                    [w.LoginWidget, {auth: deps.app.auth}],
                    ['br'],
                    ["a", {href: deps.router.href("home", {})}, 
                    "Go home now"]
                ];
                break;
            default:
                result = ["span", "It looks like you are lost. Let's ", ["a", {href: deps.router.href("home", {})}, 
                    "go home"], "."];
                break;
        }
        
        var txt = server_rendered ? "Server" : "Client";
        
        return ['div#domvm', {class: server_rendered ? '.server' : '.client'}, 
            ["div", txt],
            deps.app.auth.user() ? ["div", "You are logged in as " + JSON.stringify(deps.app.auth.user())] : null,
            ["div", deps.app.errorMessage],
            ['br'], ['br'],
            result];
    };
}

module.exports = {
    IsomorphicTestAppView: IsomorphicTestAppView,
};