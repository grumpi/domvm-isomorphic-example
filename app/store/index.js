var resources = require('../../resources');
var Promise = require('promise');
//var f = require('node-fetch');
//f.Promise = Promise;
//GLOBAL.fetch = f;

module.exports = {
    fetch: function (app, what, callbacks) {
        console.log(["fetching resources on the server", what]);
        
        return new Promise(
            function (res, err) {
                
                app.data_to_inline[what] = resources[what];
                res(resources[what]);
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