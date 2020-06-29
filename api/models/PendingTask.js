/**
 * PendingTask.js
 *
 * @description :: model data fields come from the EasyTV-Annotator app of "oeg-upm.net"
 */
module.exports = {

    schema: true,
    
    attributes: 
    {
        video: {
          type: 'string',
          description: "url for information from SPARQL endpoint"
        },
  
        videoURL: {
          type: 'string',
        },  
        mocapURL: {
          type: 'string',
        },

        wle: {
          type: 'string'
        },
  
        sle: {
            type: 'string'
          },
  
        lang: {
            type: 'string'
          },
  
        segments: {
            type: 'json',
            description: 'a list of time-stamped segments'
        },

        videoBCKP:{
          type: "string"
        }
    }
  }