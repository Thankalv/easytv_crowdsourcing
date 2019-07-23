
module.exports = {

    friendlyName: "Update organisation's API endpoints",
  
    description:  "API PATCH request to update organisation's API endpoints",
  
    inputs: {
        id: {
            type: 'string',
            description: 'The id of the organisation to update'
          },
        basic_url:{
            type: 'string',
            description: "basic url for API requests"
        },
        api_header:{
            type: 'string',
            description: "for authenticated HTTP requests"
        },
        get_editor: {
            type: 'string',
            description: "Endpoint to return jobs with status=AwaitingForEdition or OnEdition"
        },
        get_reviewer: {
            type: 'string',
            description: "Endpoint to return jobs with status=AwaitingForRevision or OnRevision"
        },
        post_credentials:{
            type: 'string',
            description : "Endpoint to register an authorized user for a job"
        }
    },

    exits: {
        success: {
          statusCode : 200,
          description: "The job/task status was changed to cancelled in CP's database"
        },
        notFound: {
          statusCode : 404,
          description: "The job/task status with given job_id was not found"
        },
      },

      
    fn: async function (inputs, exits) 
    {
        //sails.log(req.allParams());
        var orgObj = {};
        orgObj.api_info = inputs;

        var updOrg = await Organisation.updateOne({ id: inputs.id }).set(orgObj);
    
        if(updOrg)
            return exits.success({code:200, description: updOrg.token});
        else
            return exits.notFound();

    }
  
  
  };
  