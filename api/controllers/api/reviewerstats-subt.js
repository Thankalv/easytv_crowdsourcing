module.exports = {

    friendlyName: 'ReviewerStats per job posting',
    
    inputs: {
      job_id: {
            type: 'number',
            required: true,
            description: "The id of the job created"
        },
        asset_duration:{
            description: "asset duration in hh:mm:ss",
            required: true,
            type:"string"
        },
        viewed_percent_reviewer: {
            description: "When on review status, the percent of text lines viewed",
            required: true,
            type: "number"
        },
        edited_percent_reviewer: {
            description: "When on review status, the percent of text lines edited",
            required: true,
            type: "number"
        },
        validated_percent_reviewer: {
            description: "When on review status, the percent of text lines validated",
            required: true,
            type: "number"
        },
     
    },
  
    exits: {
        success: {
          description: 'The user/job reviewer-stats was recorded'
        },
        errorInAttributes: {
            statusCode: 400,
            description: 'Error detected in parameters.',
          },
        notFound: {
          statusCode: 404,
          description: 'The job_id is not under review (no stats record found).'
        },
        serverError: {
            statusCode: 500,
            description: 'Error occurred in server.',
          },
      },
  
    fn: async function (inputs, exits) 
    {
        sails.log(inputs)
        var existingJob = await UserJobStats.findOne( {task: inputs.job_id, action:'review', status: { '!=' : 'Rejected'}});
        if (!existingJob)
            return exits.notFound({code:-8, description: 'Job_id not found.'})
  
        var jobStatsRecord = await TaskService.updateUserStatistics(inputs, "reviewer");

        if(jobStatsRecord)
          return exits.success({code:200, description: 'The user/job reviewer-stats was updated'});
        else
          return exits.serverError({code:-500, description: "Undefined error occurred"});
    }
  
  
  };
  