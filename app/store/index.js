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
            app.errorMessage(err.message + " Can't reach the API server.");
            return err;
        }
        
        return Promise.resolve(resources[what]).then(onOk, onError);
        
        //var url = app.dataURL + what + '/';
        //return app.w.get(url, [onOk, onError]);
    }
};