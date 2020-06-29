module.exports = {

    friendlyName: 'List of videos for annotation, table by language',
    
    inputs: {
        clang: {
            type: 'string',
            required: true,
            description: "the user language for videos"
        }
    },

    exits: {
      success: {
        statusCode: 200,
        description: 'show lists of the available videos',
        viewTemplatePath: 'video-annotation/list'
      }
    },
  
    fn: async function (inputs) 
    {
        sails.log(inputs);
        var listVideos = await VideoAnnotated.find({lang:inputs.clang, segments: {'!=': null }});
        sails.log(listVideos);
        //var slvideos = { listVideos:listVideos };

        var userLang = inputs.clang;
        sails.log(userLang);

        return {slvideos:listVideos, userLang:userLang};
    }
  
  };
