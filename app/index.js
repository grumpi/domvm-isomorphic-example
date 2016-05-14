var v = require('./views');
var f = require('./fetch');
var Promise = require('promise');
var server = require('./server-or-client');

function IsomorphicTestApp() {
    var self = this;

    this.w = domvm.watch(function(e) {
		if (typeof document !== 'undefined') self.view.redraw();
	});

    this.context = {};
    
    
    this.initData = {};
    this.apiURL = 'http://127.0.0.1:8000/api/';
}

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        context: function (router, app, segs) {
            var ctx = {};
            ctx.title = "home";
            return ctx;
        },
    },
    contact_list: {
        path: '/contact-list/',
        context: function (router, app, segs) {
            var ctx = {};
            
            ctx.title = "Contact list";
            ctx.data = app.w.prop([]);
            
            ctx.ready = new Promise(
                function (result, error) {
                    f.fetch(app, 'contact-list').then(
                        function (res) {
                            console.log("Ready!");
                            ctx.data(res);
                            result();
                        },
                        function (err) {
                            console.log(err);
                            error();
                        }
                    );
                }
            );
            
            return ctx;
        },
    },
}

function makeOnenter(router, app, context, route) {
    function wrappedOnenter(segs) {
        console.log("onenter runs for route '" + route + "'");
        app.context = context(router, app, segs);
        document.title = app.context.title;
        app.view.redraw();
    }
    return wrappedOnenter;
}

function makeDomvmRoutes(router, app, routes) {
    var actual_routes = {};
    for (var route in routes) {
        if (routes.hasOwnProperty(route)) {
            actual_routes[route] = {};
            actual_routes[route].path = routes[route].path;
            actual_routes[route].onenter = makeOnenter(router, app, routes[route].context, route);
            actual_routes[route].onexit = routes[route].onexit;
        }
    }
    
    return actual_routes;
}

function IsomorphicTestAppRouter(router, app) {
    router.config({
        useHist: true,
    });

    return makeDomvmRoutes(router, app, IsomorphicTestAppRoutes);
}

module.exports = {
    IsomorphicTestApp: IsomorphicTestApp,
    IsomorphicTestAppRouter: IsomorphicTestAppRouter,
    IsomorphicTestAppRoutes: IsomorphicTestAppRoutes,
    IsomorphicTestAppView: v.IsomorphicTestAppView,
};