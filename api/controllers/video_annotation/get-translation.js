module.exports = {

    friendlyName: 'Retrieve a suggested SL video/translation',
    
    inputs: {
      id: {
        type: 'string',
        required: true,
        description: "the id of the input video"
      },
      videoURI: {
          type: 'string',
          required: true,
          description: "the target video URI"
      },
      targetLang: {
        type: 'string',
        required: true,
        description: "the target language to translate"
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'send a json with translation',
        viewTemplatePath: 'video-annotation/suggested-translation'
      },
    },
  
    fn: async function (inputs) 
    {
      var videoInput = await VideoAnnotated.findOne(inputs.id);

      var translation = await OntologyService.getTranslation(inputs.videoURI, inputs.targetLang );
      sails.log(translation);
      translation.lang = inputs.targetLang;

      return {videoInput: videoInput, videoTransl: translation }
    }
  
};