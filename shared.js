function renderList(data) {
    var list = [];
    var l = data.length;
    for (var i=0; i<l; i++) {
        list.push(['li', data[i].id, " ", data[i].value]);
    }
    return ["ul"].concat(list);
}

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
                    ["br"],
                    ["div", deps.app.context.data ? renderList(deps.app.context.data): 'no data'],
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
    this.context = {};
}

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        createContext: function (router, app, segs) {
            var context = {};
            context.title = "home";
            
            // TODO: replace by a simulated AJAX request that fetches data when this is otherwise working
            context.data = [
            {id: 2, value: 'something'},
            {id: 3, value: 'something else'},
            {id: 42, value: 'a strange thing'},
            ];
            
            return context;
        },
    },
    somewhere_else: {
        path: '/somewhere_else',
        createContext: function (router, app, segs) {
            var context = {};
            context.title = "somewhere else";
            return context;
        },
    },
}

function wrapOnenter(router, app, createContext, route) {
    function wrappedOnenter(segs) {
        console.log("onenter runs for route '" + route + "'");
        var context = createContext(router, app, segs);
        app.context = context;
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
            actual_routes[route].onenter = wrapOnenter(router, app, routes[route].createContext, route);
            actual_routes[route].onexit = routes[route].onexit;
        }
    }
    
    return actual_routes;
}

function IsomorphicTestAppRouter(router, app) {
    router.config({
        useHist: true,
    });

    return wrapOnenterFunctions(router, app, IsomorphicTestAppRoutes);
}

module.exports = {
    IsomorphicTestApp: IsomorphicTestApp,
    IsomorphicTestAppRouter: IsomorphicTestAppRouter,
    IsomorphicTestAppRoutes: IsomorphicTestAppRoutes,
    IsomorphicTestAppView: IsomorphicTestAppView,
};