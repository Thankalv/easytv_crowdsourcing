
module.exports = {

    friendlyName: "Refresh organisation's token",
    description:  "API POST request to refresh organisation's token",
  
    inputs: {
      id: {
          type: 'string',
          required: true,
          description: "The org's record id"
      }
    },
    exits: {
      success: {
        statusCode : 200,
        description: "The org's token was refreshed"
      },
      notFound: {
        statusCode : 404,
        description: "The requested organisation was not found"
      }
      },
      
    fn: async function (inputs, exits) 
    {
        //sails.log(req.allParams());
        var orgToken = await UtilService.uid(10);
        var updOrg = await Organisation.updateOne({ id: inputs.id }).set({token:orgToken});
    
        if(updOrg)
            return exits.success({code:200, description: updOrg.token});
        else
            return exits.notFound();
    }
  
  };
  