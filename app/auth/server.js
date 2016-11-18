module.exports = function (self, req) {
    var common = require('./common')(self);
    
    var csrftoken = req.get('X-Requested-With') || null;
    var sessionid = req.cookies['domvm-isomorphic-example-login-cookie'] || null;
    
    console.log('csrf : ' + csrftoken + '\n');
    console.log('sessionid : ' + sessionid + '\n');
    
    if(csrftoken) self.http.useCsrfValue(true, csrftoken);
    if(sessionid) self.http.useSessionValueInCookie(true, sessionid);
    
    return {
        session: sessionid,
        csrf: csrftoken,
        user: domvm.prop(null),
        init: common.init,
    }
};
