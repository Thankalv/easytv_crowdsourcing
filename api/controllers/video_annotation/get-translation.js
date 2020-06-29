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
      },
      anyway:{
        type: "boolean",
        description: "show the translation even without segmented"
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'send a view with suggested translation',
        viewTemplatePath: 'video-annotation/suggested-translation'
      },
      noTranslation: {
        statusCode: 200,
        description: 'send a json with translation',
        viewTemplatePath: 'video-annotation/no-translation'
      },
      noSegmented: {
        statusCode: 200,
        description: 'send a json with translation',
        viewTemplatePath: 'video-annotation/not-segmented'
      },
    },
  
    fn: async function (inputs, exits) 
    {
      var langs = sails.config.custom.ontologyLangs;
      var langsISO = sails.config.custom.ontologyLangsISO;

      sails.log(inputs);
      var videoInput = await VideoAnnotated.findOne(inputs.id);
      inputs.videoURI = inputs.videoURI.replace("page/", "")

      var translation = await OntologyService.getTranslation(inputs.videoURI, inputs.targetLang);
      
      if(translation=="error"){
        FlashService.warn(this.req, "sorry, the Ontology-Service seems currently down");
        return this.res.redirect("/video-annotation/show-translations");
      }
      else{
        sails.log(translation);
        var localTranslation =  await TranslationTask.findOne({sourceID: inputs.id, targetLang:inputs.targetLang});
        if(!translation.videoURL && !localTranslation)
          return exits.noTranslation({ videoRequest:videoInput, targetLang:inputs.targetLang, requestedLang: langs[langsISO.indexOf(inputs.targetLang)]});

        // Suggested translations exist for this language
        if(translation.videoURL)
          translation = await VideoAnnotated.findOne({videoURL:translation.videoURL});
        else
          translation =  await VideoAnnotated.findOne(localTranslation.targetID);

        videoInput.lang = langs[langsISO.indexOf(videoInput.lang)];
        translation.lang = langs[langsISO.indexOf(inputs.targetLang)];

        if(!translation.segments && !inputs.anyway)
          return exits.noSegmented({videoTranslation:translation, source: inputs});
        else
          return exits.success({videoInput: videoInput, videoTransl: translation });
      }
    }
  
};