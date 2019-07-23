/**
 * Accesslink
 *
 * @module      ::  Model
 * @description ::  This model contains information about a token
 * @docs        ::  http://sailsjs.org/#!documentation/models
 */

module.exports = {


    attributes: {
  
     // gives access to a user (belongs to this user)
      user: {
        model: "user",
        required: true
       },

      job_id: {
        type: 'number',
        required: true
      },

      token:{
        type: 'string',
        required: true        
      }
  
    }
  
  };
  