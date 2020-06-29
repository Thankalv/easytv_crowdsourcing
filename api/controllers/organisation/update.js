
module.exports = {

    friendlyName: "Update organisation's settings",
    description:  "Org-Administrator requests an update organisation's settings",

    inputs: 
    {
        id: {
            type: 'string',
            required: true,
            description: "The org's record id"
        },
        consent_form: {
            type: 'string',
            required: true,
            description: "The org's consent_form"
        },
        confidentiality_form:{
            type: 'string',
            required: true,
            description: "The org's confidentiality"
        },
        deleteProfileMessage:{
            type: 'string',
            required: true,
            description: "The org's delete-profile message"
        },
        consent_required: {
            type: 'boolean',
            required: true,
        },
        token_required: {
            type: 'boolean',
            required: true,
        },
        phone_required: {
            type: 'boolean',
            required: true,
        },
        prereq_lang:{
            type: 'string',
            isIn: sails.config.custom.langsISO 
        }
    },
    exits: {
        success: {
          statusCode : 200,
          description: "The org was updated successfully"
        },
        notFound: {
          statusCode : 404,
          description: "The org with this id was not found"
        },
      },

    fn: async function (inputs, exits)
    {
        sails.log(inputs);
        var orgObj = {};
        orgObj.consent_form = inputs.consent_form;
        orgObj.confidentiality_form = inputs.confidentiality_form;
        orgObj.deleteProfileMessage = inputs.deleteProfileMessage.replace('"', "'").replace("\n","");
        orgObj.consent_required = inputs.consent_required;
        orgObj.token_required = inputs.token_required;
        orgObj.phone_required = inputs.phone_required;
        orgObj.preReqLang = inputs.prereq_lang;

        var updOrg = await Organisation.updateOne(inputs.id).set(orgObj);
        if(updOrg)
            return exits.success({code:200, description: updOrg.id});
        else
            return exits.notFound();
    }
  };


