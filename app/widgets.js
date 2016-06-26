var t = require('./templates');

module.exports = {
    BoundInput: function (vm, deps) {
        function refresh(property) {
            return function (e, node) {
                property(node.el.value);
            }
        }
        
        return function () {
            deps.attrs.value = deps.property;
            deps.attrs.oninput = refresh(deps.property);
            return t.renderInput(deps.attrs);
        }
    },
    
    ContactListWidget: function (vm, deps) {
        function refreshContactList(e, node) {
            deps.query(node.el.value);
            vm.redraw();
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
    
    LoginWidget: function (vm, deps) {
        var inProgress = false;
        
        function login() {
            console.log("Trying to log in...");
            deps.auth.loginErrorMessage = null;
            
            inProgress = true;
            vm.redraw();
            
            deps.auth.loginFunction(deps.auth.username(), deps.auth.password()).then(function (res) {
                inProgress = false;
                deps.auth.username('');
                deps.auth.password('');
                return res;
            }).then(deps.auth.user, function (err) {
                if (err.data) {
                    err.data.json().then(function (err) {
                        deps.auth.loginErrorMessage = err.error;
                    });
                } else {
                    deps.auth.loginErrorMessage = "Looks like we're offline.";
                }
            });
            
            return false;
        }
        
        function logout() {
            console.log("Trying to log out...");
            inProgress = true;
            vm.redraw();
            
            deps.auth.logoutFunction().then(
                function (res) {
                    inProgress = false;
                    deps.auth.user(null);
                }
            );
            // TODO: delete cached data, etc.
        }
        
        return function () {
            return ['div.login-widget',
                deps.auth.user()
                    ? (inProgress 
                        ? ['span', 'Logging out...']
                        : ['button', {onclick: logout}, "Log out"])
                    : ["form", {method: 'POST', onsubmit: login}, [
                        deps.auth.loginErrorMessage
                            ? ["div", deps.auth.loginErrorMessage]
                            : null
                        ,
                        [module.exports.BoundInput, {attrs: {placeholder: "Username"},  property: deps.auth.username}],
                        ['br'],
                        [module.exports.BoundInput, {attrs: {placeholder: "Password", type: 'password'},  property: deps.auth.password}],
                        ['br'],
                        inProgress 
                            ? ['span', 'Trying to log in...']
                            : ['button', {type: 'submit'}, "Log in now"],
                    ]]
                ];
        }
    },
};