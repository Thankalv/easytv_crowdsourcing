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
      confidentiality_form: {
        type: 'string'
      },
      consent_required: {
        type: 'boolean'
      },
      deleteProfileMessage:{
        type: "string"
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

      testFinishedNotify:{
        type: 'boolean',
        defaultsTo: false
      },
      jobFinishedNotify:{
        type: 'boolean',
        defaultsTo: true
      },

      preReqLang:{
        type: 'string',
        isIn: sails.config.custom.langsISO
      },

      // -- volunteer-workflow related fields --//
      voluntManager: {
        model: 'user'
      },
      en1:{
        type:"string",
        defaultsTo: "Thank you for your registration, you are currently in the volunteers’ pre-selection queue."
      },
      en2:{
        type:"string",
        defaultsTo: "You're now pre-selected. You will be required to take a testing phase"
      },
      en25:{
        type:"string",
        defaultsTo: "You'have completed a testing session. Your submission is pending to be evaluated."
      },
      en3:{
        type:"string",
        defaultsTo: "You have successfully passed the validation test and now you can complete the registration process"
      },
      en4:{
        type:"string",
        defaultsTo: "You have sucessfully completed the second part of registration and you will soon be able to access Broadcaster's content"
      },
      en5:{
        type:"string",
        defaultsTo: "According to the Evaluator's decision, you have not passed the validation test and you have no access to the related content of the Broadcaster"
      },
      en6:{
        type:"string",
        defaultsTo: "You have successfully unsubscribed from the platform and your profile's data are deleted! Thank you for your participation"
      },
      en7:{
        type:"string",
        defaultsTo: "You have successfully completed the evaluation testing! You are now able to access and work on the broadcaster's content"
      },
      // --- //

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