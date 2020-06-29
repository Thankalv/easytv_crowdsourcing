module.exports = {

    friendlyName: 'update an organisation-record',
    description: "(BETA version) SuperAdmin-only methon with token-header protection",

    inputs: {
      id: {
        description: 'The id of the org to update',
        type: 'string',
        required: true
      },
      data: {
        description: 'the data of this organisation',
        type: 'json',
      }
    },
    exits: {
        success: {
          statusCode: 200,
          description: "Organisation's record was updated!"
        },
      },

    fn: async function (inputs, exits) 
    {
        var org2update = await Organisation.findOne(inputs.id);
        if (!org2update)
            return this.res.notFound('Org-id not found.');
        else {
          sails.log(inputs);
          var updatedOrg = await Organisation.updateOne({ id: inputs.id }).set(inputs.data).intercept( (err)=>{ return exits.serverError({code:-500, description: err.details})} );
          if(!updatedOrg)
            return this.res.notFound('Org-id not found.');    
          
          sails.log("Updated org: "+updatedOrg.name);         
          return exits.success({description:"Updated: "+updatedOrg.name});
        }
    }  
};
  