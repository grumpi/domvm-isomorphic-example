var Promise = require('promise');

module.exports = {
    fetch: function (app, what, callbacks) {
        console.log(["fetching resources on the client", what]);
        var url = app.apiURL + what + '/';
        var cached = app.cache.get(what);
        
        if (cached) {
            console.log("We had something cached.");
            return new Promise(
                function (res, err) {
                    res(cached);
                });
        } else {
            console.log("doing app.w.get");
            return app.w.get(url, callbacks).then(
                function (res) {
                    app.cache.set(what, res);
                    return res;
                }
            );
        }
    },
};