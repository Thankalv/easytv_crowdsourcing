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
    lastViewed: {
      type: 'string',
      description: 'A JS date-string representing the moment at which this view was requested.',
      example: "Jan 5 2017 18:00:55",
    },
    activity: {
      type: 'string',
      description: 'A descriptive string for the activity',
      example: "Reviewer has been blocked by the admin",
    },

    randomhashing: {
      type: 'string',
      description: 'A random user greeting.',
      example: "hello idiot!",
    },

  },


  beforeCreate: async function (valuesToSet, proceed) {
    
    await User.update({access:"admin"}).set({unreadLogs:true});
    //sails.log(valuesToSet.user);
    if(valuesToSet.user)
      await User.updateOne(valuesToSet.user).set({unreadLogs:true});
    
    // Hash a random password
    sails.helpers.passwords.hashPassword(sails.helpers.strings.random()).exec((err, hashedPassword)=>{
      if (err) { return proceed(err); }
      valuesToSet.randomhashing = hashedPassword;
      return proceed();
    });//_∏_
  }

};

