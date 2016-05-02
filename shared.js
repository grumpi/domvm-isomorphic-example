function IsomorphicTestAppView(vm, deps) {
    return function() {
        var route = deps.router.location();

        return ['div#domvm', route.name == 'home' 
                ? ["div#foo", ['span', deps.app.content()], 
                    ["br"], 
                    ["form",
                        ["label", "Change this before the client attaches to the server-rendered DOM:"],
                        ["br"],
                        ["input"]
                    ],
                    ["a", {href: deps.router.href("somewhere_else", {})}, 
                    "Go somewhere else"]] 
                : ["div#bar", 
                    "We are somewhere else now.", 
                    ["br"], 
                    ["a", {href: deps.router.href("home", {})}, 
                    "Go home now"]]
                    ];
    };
}

function IsomorphicTestApp() {
    var self = this;

    var w = domvm.watch(function(e) {
		if (typeof document !== 'undefined') self.view.redraw();
	});

    this.content = w.prop('');
}

function IsomorphicTestAppRouter(router, app) {
    router.config({
        useHist: true,
        init: function() {
            app.view = domvm.view(IsomorphicTestAppView, {app: app, router: router});
        }
    });

    return {
        home: {
            path: '/',
            onenter: function (segs) {
                console.log("onenter runs for home route");
                document.title = "We are home";
                app.view.redraw();
            }
        },
        somewhere_else: {
            path: '/somewhere_else/',
            onenter: function (segs) {
                console.log("onenter runs for somewhere_else route");
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