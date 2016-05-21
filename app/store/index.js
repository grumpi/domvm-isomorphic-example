var resources = require('../../resources');
var Promise = require('promise');
//var f = require('node-fetch');
//f.Promise = Promise;
//GLOBAL.fetch = f;

module.exports = {
    fetch: function (app, what) {
        console.log(["fetching resources on the server", what]);
        
        return Promise.resolve(resources[what]).then(
            function (res) {
                app.data_to_inline[what] = res;
                return res;
            });
        
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