module.exports = {

    friendlyName: '3d Viewer',
  
    description: 'Display the 3Dviewer player for a certain motion file',
    inputs: {
      id:{
        type: 'string',
        required: true,
        description: "the record to display motion-clip"
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'show the avatar viewer',
        viewTemplatePath: 'avatar/motion-clip'
      },
    },
  
    fn: async function (inputs, exits) 
    {
        var videoAnnot = await VideoAnnotated.findOne(inputs.id);

        if(videoAnnot.mocapURL)
         return exits.success({motionfile:videoAnnot.mocapURL, concept: videoAnnot.sle});
        else
          return this.res.redirect("/");
    }
  
  };
  