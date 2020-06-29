module.exports = {

    friendlyName: 'User will be prompted to upload a Sign Language video/translation',

    inputs: {
      id: {
        type: 'string',
        required: true,
        description: "the id of the input video"
      },
      targetLang: {
        type: 'string',
        required: true,
        description: "the language to translate to"
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'a view for uploading a new suggestion',
        viewTemplatePath: 'video-annotation/new-translation'
      },
      ready: {
        statusCode: 200,
        description: 'a view for annotating your suggestions',
        viewTemplatePath: 'video-annotation/new-translation-ready'
      }
    },
  
    fn: async function (inputs, exits) {
        sails.log(inputs);
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;

        var sourceVideo = await VideoAnnotated.findOne(inputs.id);
        sourceVideo.lang = langs[langsISO.indexOf(sourceVideo.lang)];
        var translTask = await TranslationTask.findOne({sourceID: inputs.id});

        if(translTask){
          if(translTask.targetID) 
            return this.res.redirect("/video-annotation/show-translations");
          translTask.sle = "";
          translTask.wle = "";
          translTask.lang = langs[langsISO.indexOf(inputs.targetLang)];
          translTask.segments = [];
          return exits.ready({videoInput: sourceVideo, videoTransl: translTask });
        }
        else
            return exits.success({videoInput: sourceVideo, targetLang: langs[langsISO.indexOf(inputs.targetLang)] });
    }
  
};