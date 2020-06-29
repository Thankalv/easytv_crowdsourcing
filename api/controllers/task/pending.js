

module.exports = {

    friendlyName: "Create an SL pending-task",
    description:  "API POST request, only allowed to evaluators",
  
    inputs: {
        wle: {
            type: 'string',
            required: true,
            description: "The job's id"
        },
        lang: {
            type: 'string',
            required: true,
            description: "the concept's lang ISO-code"
        },
    },
    exits: {
        success: {
          statusCode : 200,
          description: "The task was created!",
          viewTemplatePath: 'video-annotation/pending'
        }
      },

    fn: async function (inputs, exits) 
    {
        await PendingTask.create(inputs);
        var pTasks = await PendingTask.find({lang:this.req.session.User.firstLangISO});
        return {pTasks:pTasks};
    }
  };