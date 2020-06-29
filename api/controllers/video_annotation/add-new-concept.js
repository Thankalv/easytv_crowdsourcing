module.exports = {

    friendlyName: 'User add new SignLanguage Concept',
    
    inputs: {
      concept:{
        type:"string",
      },
      lang:{
        type:"string"
      },
      id:{
        type:"string"
      }
    },
  
    exits: {
      success: {
        statusCode: 200,
        description: 'display the video-uploading page',
        viewTemplatePath: 'video-annotation/new-concept'
      },
    },
  
    fn: async function (inputs) 
    {
      var langs = sails.config.custom.ontologyLangs;
      var langsISO = sails.config.custom.ontologyLangsISO;
      var otherLangs = [];
      await _.each(langsISO, function(lang) {
        otherLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
      });
      //otherLangs.shift();

      if (inputs.concept && inputs.lang)
        return { step:"1", concept:inputs.concept, taskId: inputs.id, lang: inputs.lang, language: langs[langsISO.indexOf(inputs.lang)]};
      else
        return { step:"1", translLangs:otherLangs, concept:null, lang:null, taskId: null };
    }
  
  };
  