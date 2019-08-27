

module.exports = {

    friendlyName: "Withdraw a user's job assignment",
  
    description:  "API POST request to cancel an assignment. Accessed by users (only for themselves) and by org's admins",
  
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
          description: "The user-job assignment is withdrawn!"
        },
        notFound: {
          statusCode : 404,
          description: "The requested assignment is not found!"
        },
        errorInAttributes: {
          statusCode: 409,
          description: 'Missing value for required attribute.',
        }
      },

    fn: async function (inputs, exits) 
    {
        inputs.job = JSON.parse(inputs.job);
        //sails.log(inputs);       
        var existingAssign = await Accesslink.findOne({job_id: inputs.job.job_id, user: inputs.userid});
        if(existingAssign){
          await Accesslink.destroyOne({job_id: inputs.job.job_id, user: inputs.userid});
          sails.log("Cancel assignment for job:", inputs.job.job_id);
          return exits.success({description:"The user-job assignment is withdrawn!"});
        }
        else{
          FlashService.error(this.req, 'The requested assignment does not exist!');
          return exits.notFound();
        }
    }
  };