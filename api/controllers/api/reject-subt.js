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
      var updTask = await Task.updateOne({ job_id: inputs.job_id })
        .set({  status: "Rejected"  });
    
      var rejectedJob = await Accesslink.findOne({job_id: inputs.job_id}).populate("user");
      if(rejectedJob)
      {
        await sails.helpers.sendTemplateEmail.with({
          to: rejectedJob.user.email,
          subject: 'Progress on job was rejected',
          template: 'email-reject-work',
          templateData: {
            fullName: User.fullName(rejectedJob.user),
            reason: inputs.reason
          }
        });

        // RE-ASSIGNMENT:: delete the previous access-triplet
        var deletedAccessLink = await Accesslink.destroyOne({job_id: inputs.job_id});
        sails.log(deletedAccessLink);

        // RE-ASSIGNMENT:: create a new access-triplet, and re-assign this user (involves POST request to broadcaster API)
        var creds = { user: rejectedJob.user.id, job_id: inputs.job_id, token: UtilService.uid(12)};
        var assignUser = await User.findOne(rejectedJob.user.id).populate('userOrganisation');
        var reAssignment = await TaskService.assignUserAJob(assignUser.userOrganisation, creds);
        sails.log(reAssignment);

        // RE-ASSIGNMENT:: create a DB record for the re-assignment's access triplet "user_id-job_id-token"
        await Accesslink.create(creds)
                      .intercept( (err)=>{  return exits.errorInAttributes({code:-13, description: err.details}); });

        // RE-ASSIGNMENT:: mark the existing stats-record as 'rejected' and also create a new one
        await TaskService.resetUserStatistics( inputs.job_id, assignUser.id);

        return exits.success({code:200, description: 'Status of job with job_id:'+rejectedJob.job_id+' was changed to rejected'});
      }
      else
      {
        return exits.notFound({code:404,  description: 'Job with id:'+inputs.job_id+' was not found'});
      }
    }
  
  
  };
  