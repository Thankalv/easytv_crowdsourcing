/**
 * Subtitle.js
 *
 * @description :: video files
 */
module.exports = {

    attributes: 
    {
        // only filename
        filename: {
          type: 'string',
          required: true,
          unique: true
        },

        description: {
          type: 'string'
        },
  
        isValidated: {
          type: 'boolean',
          defaultsTo: false
        },
  
        // ffprobe video information
        info: {
          type: 'json'
        }
    }
}