module.exports = {

    friendlyName: 'List of videos for annotation, table by language',
    
    exits: {
      signLang: {
        statusCode: 200,
        description: 'show the Sign-Language tasks page.',
        viewTemplatePath: 'video-annotation/gate'
      }
    },
  
    fn: async function (inputs,exits) 
    {
        // en0 = {url:"http://nlp-easytv.oeg-upm.net/video/en/8.mp4", id:8};       
        // var esVideos = await VideoAnnotated.find({lang:"es"}).limit(3);

        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;
        var availLangs = [];
        await _.each(langsISO, function(lang) {
          availLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
        });
        if(this.req.session.User.access=="editor"){
          this.req.session.User.usertype = "Worker";
          sails.log(this.req.session.User.usertype);
        }
        else if(this.req.session.User.access=="reviewer"){
          this.req.session.User.usertype = "Evaluator";
          sails.log(this.req.session.User.usertype);
        }
        if(!this.req.session.User.firstLang){  
          this.req.session.User.firstLang = langs[langsISO.indexOf( this.req.session.User.lang_info.langs[0]['lang0'])];
          this.req.session.User.firstLangISO = this.req.session.User.lang_info.langs[0]['lang0'];
        }
        sails.log(this.req.session.User.firstLang);
        sails.log(this.req.session.User.lang_info);
        return exits.signLang({availableLangs:availLangs});
    }
  
  };
  