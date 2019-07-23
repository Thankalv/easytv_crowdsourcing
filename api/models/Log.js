/**
 * Log.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

var moment = require('moment');

module.exports = {

  attributes: {

    user: {
      model: 'user'
    },
    ip: {
      type: 'string'
    },
    
    demoString: {
      type: 'string',
      description: 'A dummy demo string for demoing.',
    },

    lastViewed: {
      type: 'string',
      description: 'A JS date-string representing the moment at which this view was requested.',
      example: "Jan 5 2017 18:00:55",
    },

    greeting: {
      type: 'string',
      description: 'A random user greeting.',
      example: "hello idiot!",
    },

    randomhashing: {
      type: 'string',
      description: 'A random user greeting.',
      example: "hello idiot!",
    },

  },


  beforeCreate: function (valuesToSet, proceed) {
    // Hash a random password
    sails.helpers.passwords.hashPassword(sails.helpers.strings.random()).exec((err, hashedPassword)=>{
      if (err) { return proceed(err); }
      valuesToSet.randomhashing = hashedPassword;
      return proceed();
    });//_∏_
  }

};

