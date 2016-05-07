var w = require('./widgets');

function IsomorphicTestAppView(vm, deps) {
    return function() {
        var route = deps.router.location();
        var result;
        var server_rendered = deps.app.server_rendered;
        
        switch (route.name) {
            case 'home':
                result = ["div.home", 
                    ["a", {href: deps.router.href("contact_list", {})}, 
                    "Contact List"]];
                break;
            case 'contact_list':
                result = ["div.contact-list", 
                    [w.ContactListWidget, {data: deps.app.context.data, server_rendered: server_rendered }],
                    ["br"], 
                    ["a", {href: deps.router.href("home", {})}, 
                    "Go home now"]];
                break;
            default:
                result = ["span", "It looks like you are lost. Let's ", ["a", {href: deps.router.href("home", {})}, 
                    "go home"], "."];
                break;
        }
        
        var txt = server_rendered ? "Server" : "Client";
        
        return ['div#domvm', 
            ["div", txt],
            ['br'], ['br'],
            result];
    };
}

module.exports = {
    IsomorphicTestAppView: IsomorphicTestAppView,
};