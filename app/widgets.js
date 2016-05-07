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


module.exports = {
    ContactListWidget: ContactListWidget,
};