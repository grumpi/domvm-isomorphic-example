var resources = require('./../../resources');
var Promise = require('promise');

module.exports = {
    'home': function () {
        console.log("welcome-message was received successfully from the mock API.")
        return Promise.resolve(resources['welcome-message']);
    },
    'contact-list': function () {
        if(Math.random() > 0.5) {
            console.log("contact-list was received successfully from the mock API.")
            return Promise.resolve(resources['contact-list']);
        } else {
            console.log("Let's pretend that there was an error fetching from the mock API.")
            return Promise.reject(new Error("The API was too busy (this is a fake error that happens so we can mock dealing with errors)"));
        }
    },
};