module.exports = {

    friendlyName: 'Finish a subtitle job',
    
    inputs: {
  
      job_id: {
        description: 'The id of the job to finish',
        type: 'number',
        required: true
      },

    },
  
    exits: {
      success: {
        description: "The job status was set to finished"
      },
      alreadyDone: {
        statusCode: 208,
        description: "The job has been already been set as finished"
      },
      notFound: {
        statusCode : 404,
        description: "The job with given job_id was not found"
      },
    },

    fn: async function (inputs, exits) 
    {
      // Finish an existing job
      var existTask = await Task.findOne({ job_id: inputs.job_id, status: "Finished" })
      if(existTask)
        return exits.alreadyDone({ description: 'Job with id:'+existTask.job_id+' has been already finished'});

      var updTask = await Task.updateOne({ job_id: inputs.job_id })
        .set({
          status: "Finished"
        });
    
      if(updTask)
        return exits.success({code:200, description: 'Job with id:'+updTask.job_id+' is finished'});
      else
        return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not found'});
    }
  
  };
  