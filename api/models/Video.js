/**
 * Video.js
 *
 * @description :: video files
 */

module.exports = {

    schema: true,

    attributes: 
    {
        // only filename
        filename: {
          type: 'string',
          required: true,
          unique: true
        },
        // file size in bytes
        size: {
          type: 'number'
        },
        description: {
          type: 'string'
        },
  
        thumbnail:{
          type: 'string'
        },
  
        // ffprobe video information
        info: {
          type: 'json'
        },

        // created by a user
        createdBy: {
          model: 'user',
          required: true
        },
        
        // is submitted to a task
        task: {
          model: 'task',
          required: true
        },
       
    },


      // customToJSON() method called before any data gets back to the client
      customToJSON: function() {
        var obj = this;
        delete obj.info;
        return obj;
    },

  };