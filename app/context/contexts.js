// this runs on the SPA server and assembles the contexts for the SPA's individual routes
require('es6-promise').polyfill();
require('isomorphic-fetch');

function apiFetch(what, auth) {
    console.log("The SPA server tries to request the resource '" + what + "' from the API server.");
    
    return fetch('http://127.0.0.1:8000/api/resources/'+what+'/', {
        method: 'GET',
        headers: {
            'Cookie': auth ? auth.cookies : ''
        }}).then(function (resp) {
            // https://github.com/leeoniya/domvm/blob/1.x-dev/src/watch.js#L41-L49
            // purpose: make this behave as close to the domvm implementation as possible
            if (resp.status >= 200 && resp.status < 300) {
                return resp.json();
            } else {
                var err = new Error(resp.status + ": " + resp.statusText)
                err.data = resp;
                return Promise.reject(err);
            }
        });
}

module.exports = {
    'home': function (auth) {
        return apiFetch('welcome-message', auth);
    },
    'contact-list': function (auth) {
        return apiFetch('contact-list', auth);
    },
};