var t = require('./templates');

var el = domvm.defineElement,
    tx = domvm.defineText,
    vw = domvm.defineView;

function fullRedraw(vm) {
    return function () {
        vm.redraw(100);
    }
}
    
module.exports = {
    BoundInput: function (vm, deps) {
        function refresh(property) {
            return function (e, node) {
                property(node.el.value);
            }
        }
        
        return function () {
            deps.attrs.value = deps.property();
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
            return el('div.contact-list-widget', [
                el("form", [t.renderInput({placeholder: "Type to search...", value: deps.query(), oninput: refreshContactList})]),
                deps.data && deps.data()
                    ? t.renderList(deps.data().filter(matchesQuery), renderContact) 
                    : el('ul', [el('li', "Loading...")])
                ]);
        }
    },
    
    LoginWidget: function (vm, deps) {
        var inProgress = false;

        function login(e) {
            e.preventDefault();
            console.log("Trying to log in...");
            deps.auth.loginErrorMessage = null;

            inProgress = true;
            vm.redraw();

            deps.auth.login(deps.auth.username(), deps.auth.password()).then(function (res) {
                inProgress = false;
                if (res.result) {
                    deps.auth.username("");
                    deps.auth.password("");
                    return res.result;
                }
                if (res.error) {
                    console.log(['error', res]);
                    deps.auth.loginErrorMessage = res.error;
                    return null;
                }
            }, function (err) {
                inProgress = false;
                if (err.data) {
                    deps.auth.loginErrorMessage = err.message;
                    err.data.json().then(function (err) {
                        deps.auth.loginErrorMessage = err.error;
                        fullRedraw(vm)();
                    });
                } else {
                    deps.auth.loginErrorMessage = "It seems we can't reach the server (" + res.error + ")!";
                }
            }).then(fullRedraw(vm), fullRedraw(vm));

            return false;
        }

        function logout() {
            console.log("Trying to log out...");
            inProgress = true;
            vm.redraw();

            deps.auth.logout().then(
                function (res) {
                    inProgress = false;
                    if (res.error) {
                        deps.auth.loginErrorMessage = "There was an error trying to log out: " + res.error;
                    }
                    fullRedraw(vm)();
                }
            );
        }

        return function () {
            
            return el("div.login-widget", [
                deps.auth.user() ?
                    (inProgress ?
                        el("span", [tx("Logging out..."), module.exports.smallLoadingIndicator])
                        : el("div", [
                            el("h2", [tx("You're logged in as "), tx(deps.auth.user().username), tx(". "), el("button", {onclick: logout}, "Log out")]) 
                        ]))
                    : el("form", {method: "POST", onsubmit: login}, [
                        vw(module.exports.BoundInput, {label: "Username", attrs: {placeholder: "username"},  property: deps.auth.username}),
                        el("br"),
                        vw(module.exports.BoundInput, {label: "Password", attrs: {placeholder: "password", type: "password"},  property: deps.auth.password}),
                        el("br"),
                        deps.auth.loginErrorMessage ?
                            el("div.error", deps.auth.loginErrorMessage)
                            : null,
                        inProgress ?
                            el("span", [module.exports.smallLoadingIndicator, tx(" Trying to log in...")])
                            : el("button", {type: "submit"}, "Log in"),
                    ])
                ]);
        };
    },
};