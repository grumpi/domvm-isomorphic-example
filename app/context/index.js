var contexts = require('./contexts');

module.exports = function (app, what, okCallback, errorCallback) {
    console.log(["fetching context on the server", what]);

    function onOk (res) {
        app.data_to_inline[what] = res;
        okCallback(res);
        return res;
    }
    
    function onError (err) {
        app.errorMessage = err.message + " - There was a problem creating the context on the server.";
        errorCallback(err);
        return err;
    }
    
    return contexts[what](app.serverAuth).then(onOk, onError);
};