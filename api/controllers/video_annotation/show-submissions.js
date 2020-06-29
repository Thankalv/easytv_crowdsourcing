module.exports = {

    friendlyName: 'List of new-submission videos to be evaluated, in the "working" language',
    
    inputs: {
        clang: {
          type: 'string',
          description: "optional: the user language for videos"
        },
        scored:{
          type: "string",
          description: "show submissions that are evaluated"
        }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'show lists of the new submissions in your language',
        viewTemplatePath: 'video-annotation/eval-submit-list'
      }
    },
  
    fn: async function (inputs, exits) 
    {
        if(this.req.session.User.usertype == "Worker"){
          FlashService.error(this.req, "Area allowed only for moderators!")
          return this.res.redirect("/");
        }

        sails.log(inputs);
        var userLang = this.req.session.User.firstLangISO;
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;
        var otherLangs = [];

        if(!inputs.clang){
          await _.each(langsISO, function(lang) {
              if(lang!=userLang)
                otherLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
          });
        }
        else{
          userLang = inputs.clang;
          _.each(langsISO, function(lang) {
            if(lang!=inputs.clang)
              otherLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
          });
        }

        if(inputs.scored=="true")
          var listVideos = await VideoAnnotated.find({lang:userLang, scorers:{'>': 0 }, video: {'!=': "" }, sle: {'!=': "" } }).sort("createdAt DESC");
        else
          var listVideos = await VideoAnnotated.find({lang:userLang, scorers:0, video: {'!=': "" }, sle: {'!=': "" } }).sort("createdAt DESC");
          
        return exits.success({listVideos:listVideos, otherLangs:otherLangs, cLang: langs[langsISO.indexOf(userLang)] });
    }
  
  };
