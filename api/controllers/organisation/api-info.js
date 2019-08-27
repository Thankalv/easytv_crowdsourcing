
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
        getJobsURL: {
            type: 'string',
            description: "Endpoint to return jobs with status=AwaitingForEdition or OnEdition"
        },
        get_reviewer: {
            type: 'string',
            description: "Endpoint to return jobs with status=AwaitingForRevision or OnRevision"
        },
        postUserJob:{
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
        sails.log(inputs);
        var updOrg = await Organisation.findOne({ id: inputs.id });

        var orgObj = {'api_info':updOrg.api_info};
        orgObj.api_info.getJobsURL = inputs.getJobsURL;
        orgObj.api_info.postUserJob = inputs.postUserJob;

        var updOrg = await Organisation.updateOne({ id: inputs.id }).set(orgObj);
    
        if(updOrg)
            return this.res.redirect("/organisation/show?id="+inputs.id)
        else
            return exits.notFound();

    }
  
  
  };
  