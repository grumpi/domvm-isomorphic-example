module.exports = function (self) {
    return {
        login: function (username, password) {
            var opts = {};
            opts.headers = {};
            opts.method = 'POST';
            opts.body = {username: username, password: password};

            return self.http.fetchApi('login/', opts).then(function (res) {
                self.auth.user(res.result);
                self.router.refresh();
                return Promise.resolve(res);
            });
        },

        logout: function () {
            var opts = {};
            opts.headers = {};
            opts.method = 'POST';

            return self.http.fetchApi('logout/', opts).then(function (res) {
                console.log('clearing cache');
                console.log(self.cache);
                self.auth.user(null);
                self.cache.clear();
                self.router.refresh();
                return Promise.resolve(res);
            });
        },

        
        init: function () {
            var opts = {};
            opts.method = 'GET';

            return self.http.fetchApi('init/', opts).then(function (res) {
                console.log(['I am', res.result]);
                self.auth.user(res.result);
            }, function (err) {
                // TODO: make the app deal with failed init in a better way, e.g enter offline-Mode and retry connecting with exponential backoff
                // with this hack it at least starts up at all and doesn't waste lots of time on server
                return Promise.resolve(null);
            });
        },
    }
};