var kizzy = require('kizzy');
var cache = kizzy('request-cache');
var Promise = require('promise');

module.exports = {
    fetch: function (app, what, callbacks) {
        console.log("fetching on the client");
        var url = app.apiURL + what + '/';
        var cached = cache.get(what);
        console.log(['get cache', what, cached]);
        
        if (cached) {
            console.log("We had something cached.");
            return new Promise(
                function (res, err) {
                    res(cached);
                });
        } else {
            console.log("doing app.w.get");
            return app.w.get(url, callbacks);
        }
    },
};