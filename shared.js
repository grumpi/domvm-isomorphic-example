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

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        onenter: function (router, app, segs) {
            var context = {};
            context.title = "home";
            return context;
        },
    },
    somewhere_else: {
        path: '/somewhere_else',
        onenter: function (router, app, segs) {
            var context = {};
            context.title = "somewhere else";
            return context;
        },
    },
}

function wrapOnenter(router, app, onenter, route) {
    function wrappedOnenter(segs) {
        console.log("onenter runs for route '" + route + "'");
        var context = onenter(router, app, segs);
        document.title = context.title;
        app.view.redraw();
    }
    return wrappedOnenter;
}

function wrapOnenterFunctions(router, app, routes) {
    var actual_routes = {};
    for (var route in routes) {
        if (routes.hasOwnProperty(route)) {
            actual_routes[route] = {};
            actual_routes[route].path = routes[route].path;
            actual_routes[route].onenter = wrapOnenter(router, app, routes[route].onenter, route);
        }
    }
    
    return actual_routes;
}

function IsomorphicTestAppRouter(router, app) {
    router.config({
        useHist: true,
        init: function() {
            app.view = domvm.view(IsomorphicTestAppView, {app: app, router: router});
        }
    });

    return wrapOnenterFunctions(router, app, IsomorphicTestAppRoutes);
}

module.exports = {
    IsomorphicTestApp: IsomorphicTestApp,
    IsomorphicTestAppRouter: IsomorphicTestAppRouter,
};