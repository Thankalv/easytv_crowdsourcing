module.exports = {

    friendlyName: 'User will be prompted to upload a Sign Language video/translation',

    inputs: {
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'a view for uploading a new suggestion',
        viewTemplatePath: 'video-annotation/new-pair-info'
      },

    },
  
    fn: async function (inputs, exits) {
        sails.log("Displaying the info page");
        
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;
        var otherLangs = [];

        await _.each(langsISO, function(lang) {
          otherLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
        });

        otherLangs.shift();

        return exits.success({translLangs:otherLangs});
    }
};