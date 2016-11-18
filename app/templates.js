var server_rendered = require('./server-or-client');

var el = domvm.defineElement,
    tx = domvm.defineText;

module.exports = {
    renderList: function (data, f) {
        var list = [];
        
        var l = data.length;
        for (var i=0; i<l; i++) {
            list.push(el('li', f(data[i])));
        }

        return el("ul", list);
    },

    renderInput: function (opts) {
        return server_rendered 
            ? el("input", {disabled: true, value: "Loading..."})
            : el("input", opts);
    },
    
    link: function (router, target, attrs, content) {
        attrs = attrs || {};
        attrs.href = attrs.href || router.href.apply(router, target);
        attrs.onclick = function (e) {
            e.preventDefault();
            router.goto.apply(router, target);
        };
        return el('a', attrs, content);
    },
};