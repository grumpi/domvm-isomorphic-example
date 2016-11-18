function loadContext (app, context, what, params, body) {
    console.log("client fetching context for route '"+what+"'.");
    var path = 'data/' + what + '/';
    var key = what+JSON.stringify(params);
    var cached = app.cache.get(key);

    function onOk (res) {
        app.cache.set(key, res);
        return Promise.resolve(res);
    }

    function onError (err) {
        context.errorMessage = err.message;
        return Promise.reject(err);
    }

    if (cached) {
        console.log("We had something cached.");
        return Promise.resolve(cached);
    } else {
        console.log("Nothing cached, fetching context from the SPA server.");
        return app.http.fetchSpaServer(path, {
            method: 'GET',
            params: params ? params : null,
            body: body ? body : null,
            }).then(onOk, onError);
    }
}

module.exports = loadContext;