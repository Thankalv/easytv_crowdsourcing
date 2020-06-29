module.exports = {

    friendlyName: "Destroy a cancelled task",
  
    description:  "API DELETE request, only allowed to admin",
  
    inputs: {
        job_id: {
            type: 'string',
            required: true,
            description: "The job's id"
        },
        content_owner: {
          type: 'string',
          required: true,
          description: "The content_owner token"
      }
    },
    exits: {
        success: {
          statusCode : 200,
          description: "The task was deleted!"
        },
        notFound: {
          statusCode : 404,
          description: "The task was not found!"
        }
      },

    fn: async function (inputs, exits) 
    {
        //sails.log(inputs);
        var existingOrg = await Organisation.find({token: inputs.content_owner});
        if (existingOrg.length == 0)
          return exits.notFound();
        else
            inputs.content_owner = existingOrg[0].id;

        var taskFound = await Task.findOne({job_id: inputs.job_id, content_owner:inputs.content_owner});
        if(taskFound){
          await Task.destroyOne(taskFound.id);
          return exits.success({description:"The cancelled task is removed from database!"});
        }
        else{
          FlashService.error(this.req, 'The requested task was not found or is not cancelled!');
          return exits.notFound();
        }
    }
  };
