var Promise = require('promise');

module.exports = {
    fetch: function (app, what) {
        console.log(["fetching resources on the client", what]);
        var url = app.apiURL + what + '/';
        var cached = app.cache.get(what);
        
        if (cached) {
            console.log("We had something cached.");
            return Promise.resolve(cached);
        } else {
            function onOk (res) {
                app.cache.set(what, res);
                return res;
            }
            
            function onError (err) {
                app.errorMessage(err.message + " - Maybe we're offline? Or there might be a problem with the server.");
                return err;
            }
            
            console.log("Nothing cached, fetching from the API server.");
            
            return app.w.get(url, [onOk, onError]);
        }
    },
};