function loadContext (app, what, okCallback, errorCallback) {
    console.log(["fetching context on the client", what]);
    var url = app.viewContextURL + what + '/';
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
            console.log(['err', err]);
            
            if (err.data) {
                return err.data.json().then(function (body) {
                    app.errorMessage = err.message + " (" + JSON.stringify(body) + ")";
                    errorCallback(err);
                });
            } else {
                app.errorMessage = err.message + " - It looks like I'm offline or the server currently isn't reachable for some other reason.";
                errorCallback(err);
            }
        }
        
        console.log("Nothing cached, fetching context from the SPA server.");
        return app.w.get(url, [onOk, onError]);
    }
}

module.exports = loadContext;