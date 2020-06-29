module.exports = {

    friendlyName: 'User has just created a new translation-pair',

    inputs: {
      lang1: {
        type: 'string',
        description: "the #1 language"
      },
      lang2: {
        type: 'string',
        description: "the #2 language"
      },
      concept1: {
        type: 'string',
        description: "the #1 concept"
      },
      concept2: {
        type: 'string',
        description: "the #2 concept"
      },
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'a view for uploading a new suggestion',
        viewTemplatePath: 'video-annotation/new-pair-video'
      },
    },
  
    fn: async function (inputs, exits) {
      var langs = sails.config.custom.ontologyLangs;
      var langsISO = sails.config.custom.ontologyLangsISO;

      // throw an error and repeat page if user selects two same languages
      if(inputs.lang1==inputs.lang2){ 
        FlashService.warn(this.req, "Languages should NOT be the same!");
        return this.res.redirect("/video-annotation/new-pair-info")
      }

      var langs = sails.config.custom.ontologyLangs;
      var langsISO = sails.config.custom.ontologyLangsISO;
      var otherLangs = [];
      await _.each(langsISO, function(lang) {
        otherLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
      });
      otherLangs.shift();

      var existingPair = await TranslationPair.findOne({lang1:inputs.lang1, lang2:inputs.lang2, concept1:inputs.concept1, concept2:inputs.concept2});
      if(existingPair)
        var newPair = existingPair;
      else
        var newPair = await TranslationPair.create({lang1:inputs.lang1, lang2:inputs.lang2, concept1:inputs.concept1, concept2:inputs.concept2}).fetch();
      newPair.lang1_full = langs[langsISO.indexOf(newPair.lang1)];
      newPair.lang2_full = langs[langsISO.indexOf(newPair.lang2)];
      sails.log(newPair.id);

      return exits.success({newPair:newPair});
    }
};