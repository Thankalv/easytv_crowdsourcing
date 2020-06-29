module.exports = {

    friendlyName: "Assign user to job",
    description:  "API POST request to assign a user to an active job",
  
    inputs: {
        job: {
            type: 'json',
            required: true,
            description: "The job's data"
        },
        userid: {
            type: 'string',
            required: true,
            description: "The id of the user to be assigned"
        },
    },
    exits: {
        success: {
          statusCode : 200,
          description: "The requested job was assigned to the user!"
        },
        notFound: {
          statusCode : 404,
          description: "The requested job is already assigned"
        },
        blockedUser: {
          statusCode : 401,
          description: "The requesting user seems to be blocked"
        },
        errorInAttributes: {
          statusCode: 409,
          description: 'Missing value for required attribute.',
        },
      },

    fn: async function (inputs, exits) 
    {
        //sails.log(inputs.job);
        inputs.job = JSON.parse(inputs.job);
        var existingJob = await Accesslink.findOne({job_id: inputs.job.job_id});
        if(existingJob){
          FlashService.error(this.req, 'The requested job is already assigned!');
          return exits.notFound({description:"The requested job is already assigned"});
        }

        // POST request to the broadcaster API  -->  sails.log the broadcaster's response message
        var usersOrg = await Organisation.findOne(this.req.session.User.userOrganisation.id);
        if (usersOrg.blocked.users.indexOf(this.req.session.User.id)>-1){
          //FlashService.error(this.req, 'You have been blocked!');
          return exits.blockedUser({description:"You have been blocked!"});
        }

        var creds = { user:  inputs.userid, job_id: inputs.job.job_id, token: await UtilService.uid(12)}
        sails.log(creds);
        var newAssignment = await TaskService.assignUserAJob(usersOrg, creds);
        sails.log(newAssignment);
        if(newAssignment.code == 200)
        {
          // create a DB record about the access triplet "user_id-job_id-token"
          var accesslink = await Accesslink.create(creds)
                                  .intercept( (err)=>{  return exits.errorInAttributes({code:-13, description: err.details}); })
                                  .fetch();
          delete inputs.job.video_path; // status: { '!=' : 'Rejected'}
          var existingOrg = await Organisation.find({token: inputs.job.content_owner.toUpperCase()});
          inputs.job.content_owner = existingOrg[0].id;
          inputs.job.original_title = inputs.job.asset_name;
          if (this.req.session.User.access == "editor"){  
            inputs.job.action = 'edition';
            inputs.job.validated_percent = inputs.job.validated_percent_editor;
          }
          else{  
            inputs.job.action = 'review';
            inputs.job.validated_percent = inputs.job.validated_percent_reviewer;
          }
          var existingTask = await Task.findOne({job_id:inputs.job.job_id, content_owner:inputs.job.content_owner});
          if(!existingTask)
            await Task.create(inputs.job).intercept( (err)=>{  sails.log(err.details); })

          // create a new DB record about the statistics of this user on this job
          var jobStatsRecord = await TaskService.saveUserStatistics(inputs.job, inputs.userid, this.req.session.User.access);

          return exits.success({code:200, description: 'Job with id:'+accesslink.job_id+' was assigned'});
        }
        else
            return exits.notFound();
    }  
};
  