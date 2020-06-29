module.exports = {

    friendlyName: 'Update the user primary-language',

    inputs: {
      lang: {
        description: 'The lang ISO-code',
        required: true,
        type: 'string',
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: "User's primary language is updated!"
      }
    },

    fn: async function (inputs, exits) 
    {
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;
        this.req.session.User.firstLang = langs[langsISO.indexOf( inputs.lang) ];
        this.req.session.User.firstLangISO = inputs.lang;
        return exits.success({description: "User's primary language is updated to "+ this.req.session.User.firstLang });
      
    } 
};
  