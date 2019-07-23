module.exports = {

    friendlyName: 'Confirm that a subtitle job is regirested in DB',
    
    inputs: {
      job_id: {
        description: 'The id of the job to finish',
        type: 'number',
        required: true
      },
    },
  
    exits: {
      success: {
        description: "Job status is returned"
      },
      badRequest: {
        statusCode : 400,
        description: "Error in the request"
      },
      notFound: {
        statusCode : 404,
        description: "The job with given job_id was not found"
      },
    },

    fn: async function (inputs, exits) {
    
      // Return an existing job
      var updTask = await Task.findOne({ job_id: inputs.job_id });
    
      if(updTask)
        return exits.success({code:200, status: updTask.status, lastUpdated: UtilService.to_hhmmss_ddmmyyyy(updTask.updatedAt)});
      else
        return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not found'});
    }
  
  
  };
  