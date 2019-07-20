'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'regis',
    environment,
    rootURL: '/',
    locationType: 'auto',
    firebase:{
      apiKey: "AIzaSyCX-Z4f2WSbGZCUELhzZtRFjMGctN4GB5c",
      authDomain: "schoolproject-1555732245898.firebaseapp.com",
      databaseURL: "https://schoolproject-1555732245898.firebaseio.com",
      storageBucket: "schoolproject-1555732245898.appspot.com",
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      browserify: {
        extensions: ['.coffee'],
        transform: [
          ['caching-coffeeify', { global: true }]
        ]
      },
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
