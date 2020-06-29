/**
 * User.js
 *
 * @description :: User model
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var gravatar = require("gravatar");
var bcrypt = require('bcryptjs');

module.exports = {

  // only attributes that exist in the schema are saved
  // schema: true, disable to let custom fields

  attributes: {

    firstName: {
      type: "string",
      required: true
    },

    lastName: {
      type: "string",
      required: true
    },

    email: {
      type: 'string',
      unique: true,
      required: true
    },

    encryptedPassword: {
      type: 'string'
    },
    /**
     * access roles
     * worker - reviewer - admin
     */
    access: {
      type: 'string',
      defaultsTo: 'editor'
    },
    // reference to organisation the user belongsTo
   userOrganisation: {
     model: "organisation",
     required: true
    },
    
    lang_info: {
      type: 'json'
    },

    settings: {
      type: 'json'
    },

    accesslinks: {
      collection: 'accesslink',
      via: 'user'
    },
    subscriptions: {
      collection: 'subscribed',
      via: 'createdBy'
    },

    /**
     * Confidence level 1-10
     */
    trustLevel: {
      type: 'number',
      defaultsTo: -2.00
    },
    points: {
      type: 'number',
      defaultsTo: 0
    },
    
    description:{
      type: 'string',
      defaultsTo: 'new user/not provided'
    },
    // custom fields per Organisation
    phone_num: {
      type: 'string',
    },
    warrant: {
      type: "string"
    },
    personal_code: {
      type: "string"
    },
    age: {
      type: "number"
    },
    lastLogged: {
      type: "string"
    },

    gravatarImage:{
        type: "string"
    },
    
    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
    },
    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },
    
    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'change-requested', 'confirmed'],
      defaultsTo: 'unconfirmed',
      description: 'The confirmation status of the user\'s email address.'
    },

    registStatus: {
      type:"boolean"
    },

    registStatus: {
      type: 'string',
      isIn: ['pending', 'submitted', 'completed'],
      defaultsTo: 'pending',
      description: 'The register process status'
    },
    regComplete: {
      type: 'json',
      description: 'The user submitted data from the 2nd register-form'
    },
    reg2_token:{
      type: "string",
      defaultsTo: ""
    },
    unreadLogs:{
      type:"boolean",
      defaultsTo: false
    }
  },


// customToJSON() method called before any data gets back to the client
  customToJSON: function() {
        var obj = this;
        delete obj.password;
        delete obj.confirmation;
        delete obj.warrant;
        delete obj.encryptedPassword;
        delete obj._csrf;
        return obj;
  },

  /* 
   Computed user fullName string
  */
  fullName: function(user) {
    return user.firstName + " " + user.lastName;
  },


  /**
   * Lifecycle callbacks
   *
   * https://github.com/balderdashy/waterline/blob/master/README.md#lifecycle-callbacks
   */

  /**
   * [beforeCreate description]
   * @param  {[type]}   values [description]
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
  beforeCreate: function(values, cb) {
    //sails.log(values);
    // Gravatar image url
    values.gravatarImage = gravatar.url(values.email, {
          s: 128,
          r: "pg",
          d: "mm"
      }, true);
      
    // encrypt password
    if(!values.encryptedPassword)
      bcrypt.genSalt(10, function(err, salt) 
      {
        if (err) return cb(err); // check if needed || remove
        bcrypt.hash(values.password, salt, function(err, hash) 
        {
          if (err) return cb(err);
          values.encryptedPassword = hash;
          // delete password
          delete values.password
          delete values.confirmation;
          cb();
        });
      });
    else
      cb();
  },

  /**
   * [beforeUpdate description]
   * @param  {[type]}   values [description]
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
  beforeUpdate: function(values, cb) 
  {
    if(values.email)
      sails.log(values.email);
    if(values.lang_info)
      sails.log(values.lang_info);
    if(values.email)
      values.gravatarImage = gravatar.url(values.email, { s: 128,r: "pg",d: "mm"}, true);

    // do not change password if it is empty
    if (values.password && values.confirmation) 
    {
      if (values.password === values.confirmation) 
      {
        bcrypt.genSalt(10, function(err, salt) {
          if (err) return cb(err); // check if needed || remove
          bcrypt.hash(values.password, salt, function(err, hash) {
            if (err) return cb(err);
            values.encryptedPassword = hash;
            delete values.password;
            delete values.confirmation;
            cb();
          });
        });
      }
    } else {
      // new password not provided, do not change
      cb();
    }
  },

    /**
   * [beforeUpdate description]
   * @param  {[type]}   values [description]
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
  afterDestroy: async function(values, cb) 
  {
    sails.log(values.lastLogged);
    values.userOrganisation = await Organisation.findOne(values.userOrganisation);
    if(values.emailStatus=="confirmed")
      await ENService.sendEN(values, 6, "");
    // new password not provided, do not change
    cb();
  }

};
