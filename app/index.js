var v = require('./views');
var loadContext = require('./context');

function IsomorphicTestApp() {
    var self = this;

    this.globalErrorMessage = null;    
    this.context = {};   
}

var IsomorphicTestAppRoutes = {
    home: {
        path: '/',
        context: function (router, app, segs) {
            var ctx = {};
            ctx.title = "Home";
            
            ctx.data = domvm.prop('Loading...');
            
            ctx.ready = loadContext(app, ctx, 'home').then(function (res) {
                    ctx.data(res);                    
                    app.view && app.view.redraw();
                    return ctx;
                },
                function (err) {
                    ctx.data('Message could not be loaded from the server.');
                    app.view && app.view.redraw();
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
            ctx.data = domvm.prop([{id: -1, value: "Loading..."}]);
            ctx.query = domvm.prop('');
            
            ctx.ready = loadContext(app, ctx, 'contact-list').then(
                function (res) {
                    ctx.data(res);
                    app.view && app.view.redraw();
                    return ctx;
                },
                function (err) {
                    ctx.data([{id: -1, value: "Error fetching data!"}]);
                    app.view && app.view.redraw();
                    return ctx;
            });
            
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
        app.view && app.view.redraw();
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