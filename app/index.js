var v = require('./views');
var store = require('./store');
var Promise = require('promise');

function IsomorphicTestApp() {
    var self = this;

    this.w = domvm.watch(function(e) {
		if (typeof document !== 'undefined') {
            console.log(["domvm.watch triggered redraw", e]);
            self.view.redraw();
        }
	});

    this.errorMessage = this.w.prop(null);
    
    this.context = null;
    
    this.apiURL = 'http://127.0.0.1:8000/api/';
}

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        context: function (router, app, segs) {
            var ctx = {};
            ctx.title = "home";
            
            ctx.data = app.w.prop('Loading...');
            
            ctx.ready = new Promise(
                function (result, error) {
                    store.fetch(app, 'welcome-message', //).then(
                        function (res) {
                            console.log("Context ready!");
                            ctx.data(res);
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
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
            
            ctx.ready = new Promise(
                function (result, error) {
                    store.fetch(app, 'contact-list',
                        function (res) {
                            console.log("Context ready!");
                            ctx.data(res);
                        },
                        function (err) {
                            console.log(err);
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
        app.errorMessage(null);
        app.context = context(router, app, segs);
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