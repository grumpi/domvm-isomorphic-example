function IsomorphicTestAppView(vm, deps) {
    return function() {
        var route = deps.router.location();

        return route.name == 'home' 
                ? ["div#foo", ['span', deps.app.content], 
                    ["br"], 
                    ["a", {href: deps.router.href("somewhere_else", {})}, 
                    "Go somewhere else"]] 
                : ["div#bar", 
                    "We are somewhere else now.", 
                    ["br"], 
                    ["a", {href: deps.router.href("home", {})}, 
                    "Go home now"]];
    };
}

function IsomorphicTestApp() {
    var self = this;

    this.content = 'This is the server.';
}

function IsomorphicTestAppRouter(router, app) {
    router.config({
        useHist: true,
        root: "/test-app",
        init: function() {
            app.view = domvm.view(IsomorphicTestAppView, {app: app, router: router});
        }
    });

    return {
        home: {
            path: '/',
            onenter: function (segs) {
                document.title = "We are home";
                app.view.redraw();
            }
        },
        somewhere_else: {
            path: '/somewhere_else/',
            onenter: function (segs) {
                document.title = "We are somewhere else";
                app.view.redraw();
            }
        },
    };
}

module.exports = {
    IsomorphicTestApp: IsomorphicTestApp,
    IsomorphicTestAppRouter: IsomorphicTestAppRouter,
};