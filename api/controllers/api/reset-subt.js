module.exports = {

    friendlyName: 'Reset a "test" job assignment',
    description: 'This endpoint is only for serving "test" content offered the broadcaster',

    inputs: {
      job_id: {
        description: 'The id of the "test" job to be reset',
        type: 'number',
        required: true
      },
      content_owner:{
        description: "The content_owner's token",
        type: 'string',
        required: true
      }
    },
    exits: {
      success: {
        description: "The test-job was reset successfully"
      },
      notFound: {
        statusCode : 404,
        description: "No test-job with given job_id was found"
      },
    },

    fn: async function (inputs, exits)
    {
      inputs.content_owner = inputs.content_owner.toUpperCase();
      var existingOrg = await Organisation.findOne({token: inputs.content_owner});
      if (!existingOrg)
        return exits.notFound({code:404,  description: 'Org with token:'+inputs.content_owner+' was not found'});

      var updTask = await Task.updateOne({ job_id: inputs.job_id, content_owner: existingOrg.id }).set({ action: "edition", status: "AwaitingForEdition"});
      var resetedJob = await Accesslink.findOne({job_id: inputs.job_id}).populate("user");
      if(resetedJob && updTask)
      {
        // RESET a job: destroy any existing AccessLink-triplet for this job-id
        var deletedAccessLink = await Accesslink.destroy({job_id: inputs.job_id}).fetch();
        sails.log(deletedAccessLink);
        var destroyedStats = await UserJobStats.destroy({ task: inputs.job_id}).fetch();
        sails.log(destroyedStats);
        return exits.success({code:200, description: 'Job with job_id: '+resetedJob.job_id+' was reset'});
      }
      else{
        return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not found'});
      }
    }
};
