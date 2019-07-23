module.exports = {

    friendlyName: 'EditorStats per job posting',
    
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
        viewed_percent_editor: {
            description: "When on edition status, the percent of text lines viewed",
            required: true,
            type: "number"
        },
        edited_percent_editor: {
            description: "When on edition status, the percent of text lines edited",
            required: true,
            type: "number"
        },
        validated_percent_editor: {
            description: "When on edition status, the percent of text lines validated",
            required: true,
            type: "number"
        },
     
    },
  
    exits: {
        success: {
          description: 'The user/job editor-stats was recorded'
        },
        errorInAttributes: {
            statusCode: 400,
            description: 'Error detected in parameters.',
          },
        notFound: {
          statusCode: 404,
          description: 'The job_id is not under edition (no stats record found).'
        },
        serverError: {
            statusCode: 500,
            description: 'Error occurred in server.',
          },
      },
  
    fn: async function (inputs, exits) 
    {
        sails.log(inputs)
        var existingJob = await UserJobStats.findOne( {task: inputs.job_id, action:'edition', status: { '!=' : 'Rejected'}});
        if (!existingJob)
            return exits.notFound({code:-8, description: 'Job_id not found.'})
  
        var jobStatsRecord = await TaskService.updateUserStatistics(inputs, "editor");

        if(jobStatsRecord)
          return exits.success({code:200, description: 'The user/job editor-stats was updated'});
        else
          return exits.serverError({code:-500, description: "Undefined error occurred"});
    }
  
  
  };
  