module.exports = {

  friendlyName: 'Annotate selected video',
  
  inputs: {
    id: {
        type: 'string',
        required: true,
        description: "id of the video to annotate"
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
    var langs = sails.config.custom.ontologyLangs;
    var langsISO = sails.config.custom.ontologyLangsISO;

    var newAnnot = await VideoAnnotated.findOne(inputs.id);
    sails.log(newAnnot);
    if(!newAnnot.segments)
      newAnnot.segments = [];
    
    var otherLangs = [];
    _.each(langsISO, function(lang) {
      if(lang!=newAnnot.lang)
        otherLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
    });

    return { videoAnnot: newAnnot, otherLangs: otherLangs};
  }

};
