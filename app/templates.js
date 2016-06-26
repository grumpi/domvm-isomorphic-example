var server_rendered = require('./server-or-client');

module.exports = {
    renderList: function (data, f) {
        var list = [];
        
        var l = data.length;
        for (var i=0; i<l; i++) {
            list.push(['li', f(data[i])]);
        }

        return ["ul", list];
    },

    renderInput: function (opts) {
        return server_rendered 
            ? ["input", {disabled: true, value: "Loading..."}]
            : ["input", opts];
    },
};