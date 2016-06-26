function loadContext (app, context, what, okCallback, errorCallback) {
    console.log("fetching context for route '"+what+"'.");
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
            if (err.data) {
                return err.data.json().then(function (body) {
                    context.errorMessage = err.message + " (" + JSON.stringify(body) + ")";
                    errorCallback(err);
                });
            } else {
                context.errorMessage = err.message + " - It looks like I'm offline or the server currently isn't reachable for some other reason.";
                errorCallback(err);
            }
        }
        
        console.log("Nothing cached, fetching context from the SPA server.");
        return app.w.get(url, [onOk, onError]);
    }
}

module.exports = loadContext;