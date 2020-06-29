module.exports = {

    friendlyName: 'Finish a subtitle job',  
    inputs: {
      job_id: {
        description: 'The id of the job to finish',
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
        description: "The job status was set to finished"
      },
      alreadyFinished: {
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
      inputs.content_owner = inputs.content_owner.toUpperCase();
      var existingOrg = await Organisation.findOne({token: inputs.content_owner});
      if(!existingOrg)
          return exits.notFound({code:404,  description: 'Org with token:'+inputs.content_owner+' was not found'});

      var existTask = await Task.findOne({ job_id: inputs.job_id, content_owner: existingOrg.id, status: "Finished" });
      var acclink = await Accesslink.findOne({job_id: inputs.job_id}).populate("user");
      if(existTask)
        return exits.alreadyFinished({ description: 'Job with id:'+existTask.job_id+' has been already finished'});
      else
      {
        var updTask = await Task.updateOne({ job_id: inputs.job_id , content_owner: existingOrg.id }).set( {status: "Finished"} );
        if(!updTask)
          return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not found'});
        else if(!acclink)
          return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not assigned! (no accesslink found)'});
        else{
          //acclink.user.userOrganisation = await Organisation.findOne(acclink.user.userOrganisation);
          // FINISHED a job: trigger the EN-2.5 notification to the working Volunteer
          //if(acclink.user)
           // if(updTask.confidence_level=="low" && VoluntService.isTested( acclink.user, updTask.language_target))
           //   await ENService.sendEN(acclink.user, 2.5, updTask.language_target);

          // sails.log('Job with id:'+updTask.job_id+' is finished');
          if(updTask)
            return exits.success({code:200, description: 'Job with id:'+updTask.job_id+' is now finished'});
        }
      }
    }
};
  