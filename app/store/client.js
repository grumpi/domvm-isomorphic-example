var Promise = require('promise');

module.exports = {
    fetch: function (app, what, successCallback, errorCallback) {
        console.log(["fetching resources on the client", what]);
        var url = app.apiURL + what + '/';
        var cached = app.cache.get(what);
        
        if (cached) {
            console.log("We had something cached.");
            cached.fromCache = true;
            successCallback(cached);
            
            return new Promise(
                function (res, err) {
                    res(cached);
                });
        } else {
            console.log("doing app.w.get");
            
            function onOk (res) {
                app.cache.set(what, res);
                successCallback(res);
            }
            
            function onError (err) {
                app.errorMessage(err.message + " - Maybe we're offline? Or there might be a problem with the server.");
                errorCallback(err);
            }
            
            return app.w.get(url, [onOk, onError]);
        }
    },
};