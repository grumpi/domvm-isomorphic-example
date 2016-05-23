var t = require('./templates');

module.exports = {
    ContactListWidget: function (vm, deps) {
        function refreshContactList(e, node) {
            if (node) {
                deps.query(node.el.value);
                if (!deps.query) deps.query();
                vm.redraw();
            }
        }
        
        function matchesQuery(el) {
            // startswith
            return el.value.toLowerCase().lastIndexOf(deps.query().toLowerCase(), 0) === 0;
        }
        
        function renderContact(el) {
            return el.value;
        }
        
        return function () {
            return ['div.contact-list-widget',
                ["form", t.renderInput({placeholder: "Type to search...", value: deps.query ? deps.query() : '', oninput: refreshContactList})],
                deps.data && deps.data()
                    ? t.renderList(deps.data().filter(matchesQuery), renderContact) 
                    : ['ul', ['li', "Loading..."]]
                ];
        }
    },
};