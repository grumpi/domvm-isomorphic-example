var t = require('./templates');

module.exports = {
    ContactListWidget: function (vm, deps) {
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
                ["form", t.renderInput({placeholder: "Type to search...", value: query, oninput: refreshContactList})],
                deps.data
                    ? t.renderList(deps.data().filter(matchesQuery), renderContact) 
                    : ['ul', ['li', "Loading..."]]
                ];
        }
    },
};