var resources = require('./../../resources');
var Promise = require('promise');

module.exports = {
    'home': function () {
        return Promise.resolve(resources['welcome-message']);
    },
    'contact-list': function () {
        if(Math.random() > 0.5) {
            return Promise.resolve(resources['contact-list']);
        } else {
            return Promise.reject(new Error("ERROR"));
        }
    },
};