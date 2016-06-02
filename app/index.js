var v = require('./views');
var loadContext = require('./context');
var Promise = require('promise');

function IsomorphicTestApp() {
    var self = this;

    this.w = domvm.watch(function(e) {
		if (typeof document !== 'undefined') {
            console.log(["domvm.watch triggered redraw", e]);
            self.view.redraw();
        }
	});

    this.errorMessage = null;
    
    this.context = {};
}

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        context: function (router, app, segs) {
            var ctx = {};
            ctx.title = "Home";
            
            ctx.data = app.w.prop('Loading...');
            
            ctx.ready = loadContext(app, 'home',
                function (res) {
                    ctx.data(res);
                    return ctx;
                }
            ).catch(
                function (err) {
                    ctx.data('Message could not be loaded from the server.');
                    return ctx;
                }
            );
            
            return ctx;
        },
    },
    contact_list: {
        path: '/contact-list/',
        context: function (router, app, segs) {
            var ctx = {};
            
            ctx.title = "Contact list";
            ctx.data = app.w.prop([{id: -1, value: "Loading..."}]);
            ctx.query = domvm.watch().prop('');
            
            ctx.ready = loadContext(app, 'contact-list',
                function (res) {
                    ctx.data(res);
                    return ctx;
                }
            ).catch(
                function (err) {
                    ctx.data([{id: -1, value: "Error fetching data!"}]);
                    return ctx;
                }
            );
            
            return ctx;
        },
    },
}

function makeOnenter(router, app, context, route) {
    function wrappedOnenter(segs) {
        console.log("onenter runs for route '" + route + "'");
        app.errorMessage = null;
        app.context = context(router, app, segs);
        if (!app.context.ready) {
            app.context.ready = Promise.resolve(app.context);
        }
        
        app.context.ready.then(
            function (res) {
                console.log(["Context ready!", res]);
            }
        );
        
        document.title = app.context.title;
        app.view.redraw();
    }
    return wrappedOnenter;
}

function makeDomvmRoutes(router, app, routes) {
    var domvmRoutes = {};
    for (var route in routes) {
        if (routes.hasOwnProperty(route)) {
            domvmRoutes[route] = {};
            domvmRoutes[route].path = routes[route].path;
            domvmRoutes[route].onenter = makeOnenter(router, app, routes[route].context, route);
            domvmRoutes[route].onexit = routes[route].onexit;
        }
    }
    
    return domvmRoutes;
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