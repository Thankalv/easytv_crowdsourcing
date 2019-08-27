module.exports = {

    friendlyName: 'Annotate selected video',
    
    inputs: {
      id: {
          type: 'string',
          required: true,
          description: "id of the video to annotate in the app"
      }
    },

    exits: {
      success: {
        statusCode: 200,
        description: 'get this video into video-annotation app',
        viewTemplatePath: 'video-annotation/annotate'
      },
    },
  
    fn: async function (inputs) 
    {
      newAnnot = await VideoAnnotated.findOne(inputs.id);
      sails.log(newAnnot);
      if(!newAnnot.segments)
        newAnnot.segments = [];
      return { videoAnnot: newAnnot};
    }
  
  };
  