module.exports = {

    friendlyName: 'Evaluate selected video',
    
    inputs: {
      id: {
          type: 'string',
          required: true,
          description: "id of the submissions to evaluate"
      }
    },
  
    exits: {
      success: {
        statusCode: 200,
        description: 'get this video into video-annotation app',
        viewTemplatePath: 'video-annotation/eval-submission'
      },
    },
  
    fn: async function (inputs, exits) 
    {
      var langs = sails.config.custom.ontologyLangs;
      var langsISO = sails.config.custom.ontologyLangsISO;
  
      var newAnnot = await VideoAnnotated.findOne(inputs.id);
      if(!newAnnot)
        return this.res.redirect("/");
      else{
        sails.log(newAnnot.video);
        if(!newAnnot.segments)
          newAnnot.segments = [];

        return exits.success({ videoAnnot: newAnnot} );
      }
    }  
};
  