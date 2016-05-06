function renderList(data, f) {
    var list = [];
    
    var l = data.length;
    for (var i=0; i<l; i++) {
        list.push(['li', f(data[i])]);
    }
    if (l === 0) {
        list.push(['li', "No results."]);
    }
    return ["ul"].concat(list);
}


function ContactListWidget (vm, deps) {
    var query = '';
    
    function refreshContactList(e, node) {
        if (node) {
            query = node.el.value;
            if (!query) query = '';
            vm.redraw();
        }
    }
    
    function matchesQuery(el) {
        // startswith
        return el.value.toLowerCase().lastIndexOf(query.toLowerCase(), 0) === 0;
    }
    
    function renderContact(el) {
        return el.value;
    }
    
    return function () {
        return ['div.contact-list-widget',
            ["form",
                deps.server_rendered 
                    ? ["input", {disabled: true, value: "We're still loading!"}]
                    : ["input", {placeholder: "Type to search...", value: query, oninput: refreshContactList}]
                ],
                deps.data
                    ? renderList(deps.data().filter(matchesQuery), renderContact) 
                    : ['ul', ['li', "Data could not be found!"]]
            ];
    }
}

function IsomorphicTestAppView(vm, deps) {
    return function() {
        var route = deps.router.location();
        var result;
        var server_rendered = deps.app.server_rendered;
        
        switch (route.name) {
            case 'home':
                result = ["div.home", 
                    ["a", {href: deps.router.href("contact_list", {})}, 
                    "Contact List"]];
                break;
            case 'contact_list':
                result = ["div.contact-list", 
                    [ContactListWidget, {data: deps.app.context.data, server_rendered: server_rendered }],
                    ["br"], 
                    ["a", {href: deps.router.href("home", {})}, 
                    "Go home now"]];
                break;
            default:
                result = ["span", "It looks like you are lost. Let's ", ["a", {href: deps.router.href("home", {})}, 
                    "go home"], "."];
                break;
        }
        
        var txt = server_rendered ? "Server" : "Client";
        console.log(txt);
        
        return ['div#domvm', 
            ["div", txt],
            ['br'], ['br'],
            result];
    };
}

function IsomorphicTestApp() {
    var self = this;

    this.w = domvm.watch(function(e) {
		if (typeof document !== 'undefined') self.view.redraw();
	});

    this.context = {};
    this.server_rendered = false;
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
            
            // TODO: replace by a simulated AJAX request that fetches data when this is otherwise working
            ctx.data = app.w.prop([
            {id: 2, value: 'Herbert'},
            {id: 3, value: 'Susan'},
            {id: 42, value: 'Peter'},
            {id: 42, value: 'Greg'},
            {id: 42, value: 'Hans'},
            {id: 42, value: 'Janine'},
            {id: 42, value: 'Lisa'},
            {id: 42, value: 'Max'},
            ]);
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
    IsomorphicTestAppView: IsomorphicTestAppView,
};