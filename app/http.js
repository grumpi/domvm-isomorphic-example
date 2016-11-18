var axios = require('axios');

function http (settings) {
    var self = this;

    self.settings = settings;

    self.useCsrfCookie = function (s) {
        self.settings.useCsrfCookie = s;
    }
    
    self.useCsrfValue = function (s, csrftoken) {
        self.settings.useCsrfValue = s;
        if (csrftoken) {
            self.settings.csrfValue = csrftoken;
        } 
    }
    
    self.useSessionValueInCookie = function (s, sessionid) {
        self.settings.useSessionValueInCookie = s;
        if (sessionid) {
            self.settings.sessionValue = sessionid;
        } 
    }
    
    self.useSessionValueInAuthorization = function (s, sessionid) {
        self.settings.useSessionValueInAuthorization = s;
        if (sessionid) {
            self.settings.sessionValue = sessionid;
        } 
    }
    
    self.f = function (url, params) {
        
        console.log(['http.fetch', self.settings, url, params]);
        var opts = params;
        opts.url = url;
        opts.data = params.body || null;
        opts.timeout = opts.timeout || 10000;
        opts.credentials = 'include';
        opts.headers = params.headers || {};
        
        if (self.settings.useCsrfCookie) {
            opts.xsrfCookieName = 'csrftoken';
            opts.xsrfHeaderName = 'X-Requested-With';
        }
        
        if (self.settings.useCsrfValue && self.settings.csrfValue) {
            opts.headers['X-Requested-With'] = self.settings.csrfValue;
        }
        
        if (self.settings.useSessionValueInAuthorization && self.settings.sessionValue) {
            opts.headers['Authorization'] = self.settings.sessionValue;
        }
        
        if (self.settings.useSessionValueInCookie && self.settings.sessionValue) {
            opts.headers['Cookie'] = 'domvm-isomorphic-example-login-cookie='+self.settings.sessionValue;
        }
        
        function errorNoOp (err) {
            return Promise.reject(err);
        }

        function checkStatus(resp) {
            console.log(['checkStatus', resp]);
            
            if (resp.headers['content-type'].indexOf("json") === -1) {
                var err = new Error("Not a JSON response!");
                err.response = resp;
                console.log(err);
                return Promise.reject(err);
            }
            
            console.log(resp.status);
            return Promise.resolve(resp.data);
        }
        
        var result = axios.request(opts).then(checkStatus);

        console.log(['fetch', url, opts]);        

        return result;
    };

    return {
        fetch: self.f,
        fetchApi: function (resource, params) {
            return self.f(self.settings.apiURL + resource, params);
        },
        fetchSpaServer: function (resource, params) {
            return self.f(self.settings.spaServerURL + resource, params);
        },
        
        useCsrfCookie: self.useCsrfCookie,
        useCsrfValue: self.useCsrfValue,
        useSessionValueInCookie: self.useSessionValueInCookie,
        useSessionValueInAuthorization: self.useSessionValueInAuthorization,
    }
}

module.exports = http;