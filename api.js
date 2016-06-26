var resources = require('./resources');

var userData = {username: 'test', id: 4, csrf: 'csrf-token-value'};

module.exports = function (app, prefix) {
    app.post(prefix+'/login/', function (req, res) {
        console.log(['API server: Log in', req.body]);
        
        setTimeout(function () {
            if (req.body.password === 'test' && req.body.username === 'test') {
                res.cookie('domvm-isomorphic-example-login-cookie', 'example-session-value', { maxAge: 900000, httpOnly: true });
                res.json(userData);
            } else {
                res.status(404);
                res.json({error: "Login failed. Try logging in with username 'test' and password 'test'."});
            }
        }, 2000);
    });

    app.post(prefix+'/logout/', function (req, res) {
        console.log(['API server: Log out', req.cookies]);
        
        setTimeout(function () {
            res.clearCookie('domvm-isomorphic-example-login-cookie');
            res.send('You were logged out');
        }, 2000);
    });
    
    app.get(prefix+'/who-am-i/', function (req, res) {
        if (req.cookies['domvm-isomorphic-example-login-cookie'] === 'example-session-value') {
            res.json(userData);
        } else {
            res.json(null);
        }
    });

    app.get(prefix+'/resources/:what/', function (req, res) {
        var what = req.params.what;
        console.log("API server begins to serve resource '" + what + "'");
        
        console.log(['cookie/csrf', req.cookies['domvm-isomorphic-example-login-cookie'], req.get('X-Requested-With')]);
        
        if (req.cookies['domvm-isomorphic-example-login-cookie'] !== 'example-session-value') {
            var err = {error: 'No permission to access '+what};
            res.status(403);
            res.json(err);
            console.log(["API server: error!", err]);
        } else {
            res.json(resources[what]);
            console.log(['API server: sent!', resources[what]]);
        }
    });
};