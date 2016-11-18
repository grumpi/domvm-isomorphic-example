module.exports = function (self) {
    
    var common = require('./common')(self);
    
    self.http.useCsrfCookie(true);
    
    return {
        user: domvm.prop(null),
        loginErrorMessage: null,

        username: domvm.prop('test'),
        password: domvm.prop(''),

        login: common.login,
        logout: common.logout,
        init: common.init,
    }
};