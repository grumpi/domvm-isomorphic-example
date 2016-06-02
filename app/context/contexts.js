var resources = require('./../../resources');
var Promise = require('promise');

module.exports = {
    'home': function () {
        return Promise.resolve(resources['welcome-message']);
    },
    'contact-list': function () {
        return Promise.resolve(resources['contact-list']);
        //return Promise.reject(new Error("ERROR"));
    },
};