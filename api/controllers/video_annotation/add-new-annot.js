module.exports = {

  friendlyName: 'Annotate selected video',
  
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
      description: 'get this video into video-annotation app',
      viewTemplatePath: 'video-annotation/new-annot'
    },
  },

  fn: async function (inputs, exits) 
  {
    var langs = sails.config.custom.ontologyLangs;
    var langsISO = sails.config.custom.ontologyLangsISO;

    var newAnnot = await PendingTask.findOne(inputs.id);
    if(!newAnnot){  
      FlashService.error(this.req, "This tasks is finished or deleted!");
      return this.res.redirect("/");
    }
    else{
      // sails.log(newAnnot);
      if(!newAnnot.segments)
        newAnnot.segments = [];
      return exits.success({ videoAnnot: newAnnot, step:"2"});
    }
  }

};
