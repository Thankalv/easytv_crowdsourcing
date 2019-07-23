

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
        errorInAttributes: {
          statusCode: 409,
          description: 'Missing value for required attribute.',
        },
      },

    fn: async function (inputs, exits) 
    {
        inputs.job = JSON.parse(inputs.job);
        //sails.log(inputs);       
        var existingJob = await Accesslink.findOne({job_id: inputs.job.job_id});
        if(existingJob)
        {
          FlashService.error(this.req, 'The requested job is already assigned!');
          return exits.notFound({description:"The requested job is already assigned"});
        }

        // POST request to the broadcaster API  -->  sails.log the broadcaster's response message
        var usersOrg = this.req.session.User.userOrganisation;
        var creds = { user:  inputs.userid, job_id: inputs.job.job_id, token: UtilService.uid(12)}
        var newAssignment = await TaskService.assignUserAJob(usersOrg, creds);
        sails.log(newAssignment);

        if(newAssignment.code == 200)
        {
          // create a DB record about the access triplet "user_id-job_id-token"
          var acclink = await Accesslink.create(creds)
                .intercept( (err)=>{  return exits.errorInAttributes({code:-13, description: err.details}); }).fetch();
          
          // create a new DB record about the statistics of this user on this job
          var jobStatsRecord = await TaskService.saveUserStatistics(inputs.job, inputs.userid, this.req.session.User.access);
          // sails.log(jobStatsRecord);
          return exits.success({code:200, description: 'Job with id:'+acclink.job_id+' was assigned'});
        }
        else
            return exits.notFound();
    }
  
  };
  