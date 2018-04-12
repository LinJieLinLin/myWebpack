'use strict';
/* global browser */
require('babel-register')({
    presets: [
        'es2015'
    ]
});

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'e2e/**/*.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://rcp.dev.gdy.io/',

    framework: 'jasmine',

    onPrepare: function() {
        browser.driver.manage().window().maximize();
    },
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};