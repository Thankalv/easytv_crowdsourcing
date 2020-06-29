module.exports = {

    friendlyName: 'List of videos for evaluating translations, display by language',
    
    inputs: {
        clang: {
          type: 'string',
          description: "optional: the user language for videos"
        }
    },

    exits: {
      evaluator: {
        statusCode: 200,
        description: 'show lists of the available videos with suggested translations',
        viewTemplatePath: 'video-annotation/eval-translate'
      },
      worker: {
        statusCode: 200,
        description: 'show lists of the available videos with suggested translations',
        viewTemplatePath: 'video-annotation/show-translate'
      }
    },
  
    fn: async function (inputs, exits) 
    {
        sails.log(inputs);
        var targetLangISO = "";
        var userLang = this.req.session.User.firstLangISO;
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;
        var otherLangs = [];

        await _.each(langsISO, function(lang) {
          if(lang!=userLang)
            otherLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
        });
        if(inputs.clang)
          targetLangISO = inputs.clang;
        else 
        targetLangISO= otherLangs[0][1];
        
        
        var listVideos = await VideoAnnotated.find({lang:userLang, segments: {'!=': null }});

        if(this.req.session.User.usertype == "Evaluator")
          return exits.evaluator({listVideos:listVideos, otherLangs:otherLangs, targetLangISO:targetLangISO, targetLang: langs[langsISO.indexOf(targetLangISO)] });
        else 
          return exits.worker({listVideos:listVideos, otherLangs:otherLangs, targetLangISO:targetLangISO, targetLang: langs[langsISO.indexOf(targetLangISO)] });
    }
  
  };
