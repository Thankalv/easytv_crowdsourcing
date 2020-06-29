module.exports = {

    friendlyName: 'Provide the mocap file',
    inputs: {
      id: {
          type: 'string',
          required: true,
          description: "id of the pending task"
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'show an upload area for this subtask',
        viewTemplatePath: 'video-annotation/new-mocap'
      },
    },
    fn: async function (inputs) 
    {
      var langs = sails.config.custom.ontologyLangs;
      var langsISO = sails.config.custom.ontologyLangsISO;
  
      var newAnnot = await VideoAnnotated.findOne(inputs.id);
      if(!newAnnot){  
        FlashService.error(this.req, "This task has been finished or deleted");
        return this.res.redirect("/");
      }
      if(newAnnot.mocapURL)
        newAnnot["finished"] = true;

      return { videoAnnot: newAnnot, step:"3"};
    }  
};
  