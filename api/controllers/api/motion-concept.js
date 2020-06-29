
const path = require('path');

module.exports = {
    friendlyName: 'Match a motion-concept and download an fbx',
    
    inputs: {
      lang: {
        description: 'the language of the concepts',
        type: 'string',
        required: true
      },
      concept: {
        description: 'the concept to search for',
        type: 'string',
        required: true
      },
    },
    exits: {
      success: {
        description: "Motion-file is returned for requested concept"
      },
      notFound: {
        statusCode : 404,
        description: "No motion file was found for your requested"
      }
    },
    fn: async function (inputs, exits) {
      var dir = path.resolve('assets/');

      var concepts = await VideoAnnotated.find({lang:inputs.lang, wle: inputs.concept, mocapURL: {'!=': "" }}).sort("vscore DESC");
      if(concepts.length==0)
          return exits.notFound({code:404,  description: 'No motion-file recorder for concept: '+inputs.concept});
      else
      {
        this.res.setHeader('confidence', concepts[0].vscore);
        this.res.attachment( concepts[0].mocapURL );
        var downloading = await sails.startDownload( dir + concepts[0].mocapURL );
        return exits.success(downloading);
      }
    }  
};