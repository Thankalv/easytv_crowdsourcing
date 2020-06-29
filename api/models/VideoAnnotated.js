/**
 * VideoAnnotated.js
 *
 * @description :: model data fields come from the EasyTV-Annotator app of "oeg-upm.net"
 */
module.exports = {

  schema: true,
  
  attributes: 
  {
      video: {
        type: 'string',
        required: true,
        unique: true,
        description: "URL for information from SPARQL endpoint"
      },

      videoURL: {
        type: 'string',
        required: true,
      },

      mocapURL: {
        type: 'string',
      },
      hashstring:{
        type: "string"
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

      mocapBCKP:{
        type: "string"
      },

      vscore: {
        type:"number",
        description: "a user generated evaluation",
        min: 0
      },
      scorers: {
        type:"number",
        description: "the number of scorers till now",
        isInteger: true,
        min: 0
      }
  }
}