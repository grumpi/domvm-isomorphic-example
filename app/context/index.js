// runs on the SPA server only, for rendering HTML pages
var contexts = require('./contexts');

function loadContext(app, context, what, params, body) {
    console.log("the SPA running on the server tries to fetch the context for route '"+what+"'.");
    var path = 'data/' + what + '/';

    function onOk (res) {
        app.data_to_inline[what] = res;
        return res;
    }

    function onError (err) {
        context.errorMessage = err.message;
        return err;
    }

    return app.http.fetchSpaServer(path, {
        method: 'GET',
        params: params ? params : null,
        body: body ? body : null,
        }).then(onOk, onError);
};

module.exports = loadContext;