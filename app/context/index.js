// runs on the SPA server only, for rendering HTML pages
var contexts = require('./contexts');

module.exports = function (app, context, what, okCallback, errorCallback) {
    console.log("the SPA running on the server tries to fetch the context for route '"+what+"'.");
    var url = app.viewContextURL + what + '/';
    
    function onOk (res) {
        app.data_to_inline[what] = res;
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
            context.errorMessage = err.message + " - It looks like the context server isn't reachable.";
            errorCallback(err);
        }
    }
    
    return app.w.fetch('GET', url, null, [onOk, onError], {
        headers: {
            'Cookie': app.serverAuth.cookies
        }
    });
};