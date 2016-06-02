var Promise = require('promise');

function loadContext (app, what, okCallback, errorCallback) {
    console.log(["fetching context on the client", what]);
    var url = app.dataURL + what + '/';
    var cached = app.cache.get(what);
    
    if (cached) {
        console.log("We had something cached.");
        okCallback(cached);
        return Promise.resolve(cached);
    } else {
        function onOk (res) {
            app.cache.set(what, res);
            okCallback(res);
            return res;
        }
        
        function onError (err) {
            app.errorMessage = err.message + " - Maybe we're offline? Or there might be a problem with the server.";
            errorCallback(err);
            return Promise.reject(err);
        }
        
        console.log("Nothing cached, fetching context from the SPA server.");
 
        return app.w.get(url, [onOk, onError]);
    }
}

module.exports = loadContext;