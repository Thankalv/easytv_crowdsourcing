/**
 * Organisation.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      name: {
        type: 'string',
        unique: true,
        required: true
      },
      description: {
        type: 'string'
      },
      consent_form: {
        type: 'string'
      },
      consent_required: {
        type: 'boolean'
      },
      // custom fields
      warrant: {
        type: 'boolean'
      },
      personal_code: {
        type: 'boolean'
      },
      token: {
        type: 'string'
      },
      token_required:{
        type: 'boolean',
        defaultsTo: false
      },
      phone_required:{
        type: 'boolean',
        defaultsTo: false
      },
      // member to use for testing purpose
      editor2Assign: {
        model: "user",
      },
      // member to use for testing purpose
      reviewer2Assign: {
        model: "user",
      },
    
      api_info: {
        type: 'json'
      },

      lang_info: {
        type: 'json'
      },
      blocked: {
        type: 'json'
      },

      /* Associations */
      // an organisation has many users
      users: {
        collection: 'user',
        via: 'userOrganisation'
      },

      // an organisation manages many tasks
      tasks: {
        collection: 'task',
        via: 'content_owner'
      },

    }
  };