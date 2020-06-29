module.exports = {

    friendlyName: 'List of videos for annotation, table by language',
    
    inputs: {
        clang: {
            type: 'string',
            required: true,
            description: "the user language for videos"
        },
        keysearch: {
          type: 'string',
          required: true,
          description: "the user language for videos"
      }
    },

    exits: {
      success: {
        statusCode: 200,
        description: 'show lists of the available videos',
        viewTemplatePath: 'video-annotation/search-results'
      }
    },
  
    fn: async function (inputs) 
    {
        sails.log(inputs);
        var videosNoAnnot = await VideoAnnotated.find({lang:inputs.clang, segments: null, sle: { contains: inputs.keysearch }});
        var videosAnnot = await VideoAnnotated.find({lang:inputs.clang, segments: {'!=': null }, sle: { contains: inputs.keysearch }});
        //sails.log(listVideos);
        var userLang = inputs.clang;
        sails.log(userLang);

        return {notAnnotVideos:videosNoAnnot, AnnotVideos:videosAnnot, userLang:userLang, keyword: inputs.keysearch};
    }
};
