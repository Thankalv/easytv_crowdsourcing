
module.exports = {

    friendlyName: "Update organisation's email notifications text",
    inputs: {
        id: {
            type: 'string',
            required: true,
            description: "The org's record id"
        },
        en1_content: {
            type: 'string',
            required: true,
            description: "The org's en1"
        },
        en2_content: {
          type: 'string',
          required: true,
          description: "The org's en2"
        },
        en25_content: {
            type: 'string',
            required: true,
            description: "The org's en25"
        },
        en3_content: {
          type: 'string',
          required: true,
          description: "The org's en3"
        },
        en4_content: {
          type: 'string',
          required: true,
          description: "The org's en4"
        },
        en5_content: {
          type: 'string',
          required: true,
          description: "The org's en5"
        },
        en6_content: {
          type: 'string',
          required: true,
          description: "The org's en6"
        },
        en7_content: {
          type: 'string',
          required: true,
          description: "The org's en7"
        },
        testFinishedNotify:{
          type: 'boolean',
          required: true,
        },
        jobFinishedNotify:{
          type: 'boolean',
          required: true,
        },
        voluntManager:{
          type: "string",
          description: "the volunteer-manager's user-id"
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
        orgObj.en1 = inputs.en1_content;
        orgObj.en2 = inputs.en2_content;
        orgObj.en25 = inputs.en25_content;
        orgObj.en3 = inputs.en3_content;
        orgObj.en4 = inputs.en4_content;
        orgObj.en5 = inputs.en5_content;
        orgObj.en6 = inputs.en6_content;
        orgObj.en7 = inputs.en7_content;
        orgObj.testFinishedNotify = inputs.testFinishedNotify;
        orgObj.jobFinishedNotify = inputs.jobFinishedNotify;
        if(inputs.voluntManager)
          var admin = await User.findOne(inputs.voluntManager);
        if (admin && admin.access=="admin"){
            orgObj.voluntManager = inputs.voluntManager;
        }

        var updOrg = await Organisation.updateOne(inputs.id).set(orgObj);
        if(updOrg)
            return exits.success({code:200, description: updOrg.id});
        else
            return exits.notFound();
    }
  };


