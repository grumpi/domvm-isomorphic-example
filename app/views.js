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

module.exports = {
    IsomorphicTestAppView: IsomorphicTestAppView,
};