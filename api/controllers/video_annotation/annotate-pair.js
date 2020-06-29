module.exports = {

    friendlyName: 'User will be prompted to upload a Sign Language video/translation',

    inputs: {
      id: {
        type: 'string',
        required: true,
        description: "the id of the translation pair"
      }
    },
    exits: {
      ready: {
        statusCode: 200,
        description: 'a view for annotating your suggestions',
        viewTemplatePath: 'video-annotation/new-translation-pair'
      }
    },
  
    fn: async function (inputs, exits) {
        sails.log(inputs);
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;

        var readyPair = await TranslationPair.findOne(inputs.id);
        if(readyPair.ready=="YES")
          return this.res.redirect("/")
          
        readyPair.langfull1 = langs[langsISO.indexOf(readyPair.lang1)];
        readyPair.langfull2 = langs[langsISO.indexOf(readyPair.lang2)];

        return exits.ready({readyPair: readyPair});
    }
  
};