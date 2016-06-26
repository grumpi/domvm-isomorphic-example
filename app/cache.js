// part of the SPA client, only runs in the user's browser
var kizzy = require('kizzy');

var cache = kizzy('data');

module.exports = {
    set: function (key, value) {
        var timeout = 15000;
        console.log(['set cache', key, value]);
        cache.set(key, value, timeout);
        setTimeout(function () {
            console.log(['cache expired', key, value]);
        }, timeout);
    },
    get: function (key) {
        var cached = cache.get(key);
        console.log(['get cache', key, cached]);
        return cached;
    },
    clear: function () {
        cache.clear();
    }
}