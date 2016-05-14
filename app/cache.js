var kizzy = require('kizzy');

var cache = kizzy('request-cache');

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
    }
}