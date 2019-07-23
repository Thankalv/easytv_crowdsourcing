module.exports = {

    friendlyName: 'Cancel a subtitle job',
  
    description: 'Cancel an existing job.',
  
    inputs: {
  
      job_id: {
        description: 'The id of the job to cancel',
        type: 'number',
        required: true
      },

    },
  
    exits: {
      success: {
        description: "The job/task status was changed to cancelled in CP's database"
      },
      alreadyDone: {
        statusCode: 208,
        description: "The job has been already cancelled"
      },
      notFound: {
        statusCode : 404,
        description: "The job/task status with given job_id was not found"
      },
    },

    fn: async function (inputs, exits) 
    {
      // Cancel an existing job
      var existTask = await Task.findOne({ job_id: inputs.job_id, status: "Cancelled" })
      if(existTask)
        return exits.alreadyDone({ description: 'Job with id:'+existTask.job_id+' has been already cancelled'});

      var updTask = await Task.updateOne({ job_id: inputs.job_id })
        .set({
          status: "Cancelled"
        });
    
      if(updTask)
        return exits.success({code:200, description: 'Job with id:'+updTask.job_id+' was cancelled'});
      else
        return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not found'});
    }
  
  
  };
  