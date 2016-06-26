var v = require('./views');
var loadContext = require('./context');

function IsomorphicTestApp() {
    var self = this;

    this.w = domvm.watch(function(e) {
		if (typeof document !== 'undefined') {
            console.log(["domvm.watch triggered redraw", e]);
            self.view.redraw();
        }
	});
    
    this.context = {};
    
    this.auth = {
        user: self.w.prop(null),
        loginErrorMessage: self.w.prop(null),
        
        username: domvm.watch().prop('test'),
        password: domvm.watch().prop(''),
        
        loginFunction: function (username, password) {
            console.log(['loginFunction', username, password]);
            return self.w.post(self.loginURL, {username: username, password: password});
        },
        
        logoutFunction: function () {
            console.log('logoutFunction');
            
            return self.w.post(self.logoutURL, null, [function (res) {
                console.log('clearing cache');
                console.log(self.cache);
                self.cache.clear();
                return res;
            }]);
        },
    };
}

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        context: function (router, app, segs) {
            var ctx = {};
            ctx.title = "Home";
            
            ctx.data = app.w.prop('Loading...');
            
            ctx.ready = loadContext(app, ctx, 'home', ctx.data)
            .catch(
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
            
            ctx.ready = loadContext(app, ctx, 'contact-list', ctx.data)
            .catch(
                function (err) {
                    ctx.data([{id: -1, value: "Error fetching data!"}]);
                    return ctx;
                }
            );
            
            return ctx;
        },
    },
    login: {
        path: '/login/',
        context: function (router, app, segs) {
            var ctx = {};
            
            ctx.title = "Login";
            ctx.data = {};
            
            return ctx;
        }
    },
}

function makeOnenter(router, app, context, route) {
    function wrappedOnenter(segs) {
        console.log("onenter runs for route '" + route + "'");
        app.context = context(router, app, segs);
        app.context.errorMessage = null;
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