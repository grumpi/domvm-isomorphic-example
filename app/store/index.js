var resources = require('../../resources');
var Promise = require('promise');
//var f = require('node-fetch');
//f.Promise = Promise;
//GLOBAL.fetch = f;

module.exports = {
    fetch: function (app, what) {
        console.log(["fetching resources on the server", what]);

        function onOk (res) {
            app.data_to_inline[what] = res;
            return res;
        }
        
        function onError (err) {
            app.errorMessage(err.message + " - Maybe we're offline? Or there might be a problem with the server.");
            return err;
        }
        
        return Promise.resolve(resources[what]).then(onOk, onError);
        
        /*
        return app.w.get(url, callbacks).then(
            function (res) {
                console.log(res);
            },
            function (err) {
                console.log(err);
            }
        );
        */
    }
};