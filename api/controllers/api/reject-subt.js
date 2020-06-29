module.exports = {

    friendlyName: 'Reject a user progress',
    description: 'Reject a user progress, this results to a user email-notification and job re-assign.',

    inputs: {
      job_id: {
        description: 'The id of the job to cancel',
        type: 'number',
        required: true
      },
      reason: {
        description: 'Contains the notes written by a reviewer',
        type: 'string',
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
        description: "The job/task status was changed to rejected in CP's database"
      },
      notFound: {
        statusCode : 404,
        description: "No job with given job_id was found"
      },
    },

    fn: async function (inputs, exits)
    {
      inputs.content_owner = inputs.content_owner.toUpperCase();
      var existingOrg = await Organisation.findOne({token: inputs.content_owner});
      if (!existingOrg)
        return exits.notFound({code:404,  description: 'Org with token:'+inputs.content_owner+' was not found'});

      var updTask = await Task.updateOne({ job_id: inputs.job_id, content_owner: existingOrg.id }).set({ status: "Rejected" });

      //var rejectedJob = await Accesslink.findOne({job_id: inputs.job_id}).populate("user");
      var rejectedJobStats = await UserJobStats.find({task: inputs.job_id, action: "edition"}).populate("worker").sort("createdAt DESC");
      if(rejectedJobStats[0] && rejectedJobStats[0].worker)
      {
        rejectedJobStats[0].worker.userOrganisation = existingOrg;
        var adminCC = await User.findOne(rejectedJobStats[0].worker.userOrganisation.voluntManager);
        await sails.helpers.sendTemplateEmail.with({
          to: rejectedJobStats[0].worker.email,
          cc: adminCC.email,
          subject: 'Progress on job was rejected',
          template: 'email-reject-work',
          templateData: {
            fullName: User.fullName(rejectedJobStats[0].worker),
            job_id: inputs.job_id,
            reason: inputs.reason
          }
        });
        await Log.create({user:rejectedJobStats[0].worker.id, activity:"Work of user: "+ rejectedJobStats[0].worker.email +" in job: "+
                          inputs.job_id +" has been rejected with the following reason:<br><b style='color:red'>"+inputs.reason+"</b>"});

        // RE-ASSIGNMENT:: delete the previous access-triplet
        var deletedAccessLink = await Accesslink.destroyOne({job_id: inputs.job_id});
        sails.log(deletedAccessLink);

        // RE-ASSIGNMENT:: create a new access-triplet, and re-assign this user (involves a POST request to broadcaster API)
        var creds = { user: rejectedJobStats[0].worker.id, job_id: inputs.job_id, token: await UtilService.uid(12)};
        var assignUser = await User.findOne(rejectedJobStats[0].worker.id).populate('userOrganisation');
        var reAssignment = await TaskService.assignUserAJob(assignUser.userOrganisation, creds);
        sails.log(reAssignment);

        // RE-ASSIGNMENT:: create a DB record for the re-assignment's access triplet "user_id-job_id-token"
        await Accesslink.create(creds).intercept( (err)=>{  return exits.errorInAttributes({code:-13, description: err.details}); });
        // RE-ASSIGNMENT:: mark the existing stats-record as 'rejected' and also create a new one
        await TaskService.resetUserStatistics( inputs.job_id, assignUser.id);

	      await Task.updateOne({ job_id: inputs.job_id, content_owner: existingOrg.id }).set({ action: "edition",status: "Rejected" });

        return exits.success({code:200, description: 'Status of job with job_id: '+rejectedJobStats[0].task+' was changed to rejected'});
      }
      else{
        return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not found'});
      }
    }
};

