// this runs on the SPA server only
require('es6-promise').polyfill();
require('isomorphic-fetch');

function apiFetch(what, auth) {
    return domvm.watch().fetch('GET', 'http://127.0.0.1:8000/api/resources/'+what+'/', null, null, {
        headers: {
            'X-Requested-With': auth ? auth.csrf : 'nope',
            'Cookie': auth ? auth.cookies : ''
        }});
}

module.exports = {
    'home': function (auth) {
        return apiFetch('welcome-message', auth);
    },
    'contact-list': function (auth) {
        return apiFetch('contact-list', auth);
    },
};