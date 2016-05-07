var resources = require('../../resources');
var Promise = require('promise');
var f = require('node-fetch');
f.Promise = Promise;
GLOBAL.fetch = f;

module.exports = {
    fetch: function (app, url, callbacks) {
        console.log("this is where we fetch on the server");
        
        return new Promise(
            function (res, err) {
                res(resources.contactList);
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