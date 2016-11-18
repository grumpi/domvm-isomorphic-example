var w = require('./widgets');
var t = require('./templates');
var server_rendered = require('./server-or-client');

var el = domvm.defineElement,
    tx = domvm.defineText,
    vw = domvm.defineView;

function IsomorphicTestAppView(vm, deps) {
    return function() {
        var route = deps.router.location();
        var result;
        
        switch (route.name) {
            case 'home':
                result = el("div", [
                    el('div', [deps.app.context.data ? tx(deps.app.context.data()) : tx("Loading...")]),
                    el('br'),
                    t.link(deps.router, ['contact_list'],  null, "Contact List"),
                    el('br'),
                    el('br'),
                    t.link(deps.router, ['login'], null, "Login"),
                    ]);
                break;
            case 'contact_list':
                result = el("div", [
                    vw(w.ContactListWidget, {data: deps.app.context.data, query: deps.app.context.query }),
                    el("br"), 
                    t.link(deps.router, ['home'], null, "Go home now"),
                    ]);
                break;
            case 'login':
                result = el("div", [
                    vw(w.LoginWidget, {auth: deps.app.auth}),
                    el('br'),
                    t.link(deps.router, ['home'],  null, "Go home now"),
                ]);
                break;
            default:
                result = el("span", [tx("It looks like you are lost. Let's "), t.link(deps.router, ['home'],  null, "go home"), tx(".")]);
                break;
        }
        
        var txt = server_rendered ? "Server" : "Client";
        
        return el('div#domvm', {class: server_rendered ? '.server' : '.client'}, [
            el("div", txt),
            deps.app.auth.user() ? el("div", "You are logged in as " + JSON.stringify(deps.app.auth.user())) : null,
            el("div", deps.app.globalErrorMessage),
            el("div", deps.app.context.errorMessage),
            el('br'), el('br'),
            result]);
    };
}

module.exports = {
    IsomorphicTestAppView: IsomorphicTestAppView,
};