
module.exports = {
    fetch: function (app, url, callbacks) {
        console.log("fetching on the client");
    
        return app.w.get(url, callbacks);
    },
};