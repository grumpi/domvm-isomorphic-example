// this runs on the SPA server and assembles the contexts for the SPA's individual routes

function loadResource(app, what, params, body) {
    console.log(["The SPA server tries to request the resource '" + what + "' from the API server.", params]);

    return app.http.fetchApi('resources/'+what+'/', {
        method: 'GET',
        params: params ? params : null,
        body: body ? body : null
        });    
}

module.exports = {
    'home': function (app) {
        return loadResource(app, 'welcome-message', null, null);
    },
    'contact-list': function (app, params) {
        return loadResource(app, 'contact-list', null, null);
    },
};
