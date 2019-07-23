

module.exports = {

    friendlyName: "Regenerate a token for job assignment",
    
    inputs: {
        token: {
            type: 'string',
            required: true,
            description: "The assignment's token"
        }
    },

    exits: {
        success: {
          statusCode : 200,
          description: "Token for this job was refreshed!"
        },
        notFound: {
          statusCode : 404,
          description: "The requested token does not exist!"
        },
        errorInAttributes: {
          statusCode: 409,
          description: 'Missing value for required attribute.',
        },
      },

    fn: async function (inputs, exits) 
    {
        sails.log(inputs);       
        var existingJob = await Accesslink.findOne({token: inputs.token});
        if(!existingJob){
          return exits.notFound({description:"The requested token does not exist!"});
        }
        // POST request to the broadcaster API  -->  sails.log the broadcaster's response message
        var usersOrg = this.req.session.User.userOrganisation;
        var creds = { user:  existingJob.user, job_id: existingJob.job_id, token: UtilService.uid(12)}
        var newAssignment = await TaskService.assignUserAJob(usersOrg, creds);
        sails.log(newAssignment);

        if(newAssignment.code == 200){
          // update a DB record about the access triplet "user_id-job_id-token"
          var acclink = await Accesslink.updateOne({token:inputs.token}).set(creds)
                  .intercept( (err)=>{  return exits.errorInAttributes({code:-13, description: err.details}); });
          return exits.success({code:200, description: 'Token for job_id:'+acclink.job_id+' was refreshed'});
        }
        else
            return exits.notFound();
    }
  
  };
  