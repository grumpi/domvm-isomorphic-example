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
    
    this.context = {};
    
    this.dataURL = 'http://127.0.0.1:8000/data/';
}

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        context: function (router, app, segs) {
            var ctx = {};
            ctx.title = "home";
            
            ctx.data = app.w.prop('Loading...');
            
            ctx.ready = store.fetch(app, 'welcome-message').then(
                function (res) {
                    ctx.data(res);
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
            
            ctx.ready = store.fetch(app, 'contact-list').then(
                function (res) {
                    ctx.data(res);
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
        app.errorMessage(null);
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