module.exports = {

    friendlyName: 'Show an organisation',
  
    description: "Show & edit page for administrating organisations' options",
  
    inputs: {
        id: {
          description: 'The id of the organisation to show',
          type: 'string',
        },
    },

    exits: {
  
      success: {
        statusCode: 200,
        description: 'display the organisation configuration',
        viewTemplatePath: 'organisation/show'
      },

      invalid: {
        responseType: 'badRequest',
        description: 'There was an internal error while processing the request.'
      }
  
    },
  
    fn: async function (inputs, exits) 
    {
        var orgid = inputs.id;
        sails.log(orgid);

        if (!orgid)
        {
            FlashService.error(this.req, 'no parameter id was found.');
            return this.res.redirect('/');
        }
        else{
            //var orgid = inputs.id;
            var existingOrg = await Organisation.find( {id: inputs.id});
            if (existingOrg.length == 0)
                return exits.invalid({code:-8, description: 'The provided org id token is not registered!.'})            

            return exits.success({organisation: existingOrg[0]});
        }
    }
  
  };
  