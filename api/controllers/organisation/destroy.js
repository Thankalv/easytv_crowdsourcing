module.exports = {

    friendlyName: 'Remove an organisation from the platform',
  
    inputs: {
        id: {
          description: 'The id of the organisation to destroy',
          type: 'string',
          required: true
        },
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'return the destroyed the organisation configuration'
      }
    },
  
    fn: async function (inputs, exits) 
    {
        var orgid = inputs.id;
        sails.log(orgid);
        var deletedOrg = await Organisation.destroyOne(inputs.id);
        return exits.success(deletedOrg);
        
    }  
};
  