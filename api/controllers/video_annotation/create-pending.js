module.exports = {

      friendlyName: "Create a new task for a concept in the target Sign Language",
      
      inputs: {
            lang: {
                  type: 'string',
                  required: true,
                  description: "the target language to translate"
            },
            sle: {
                  type: 'string',
                  description: "the concept in Sign-Language order"
            },
            wle: {
                  type: 'string',
                  required: true,
                  description: "the concept in Natural-Language order"
            },
      },
  
      exits: {
        success: {
          statusCode: 200,
          description: "display to the user pending concepts in her/his Sign Language",
          viewTemplatePath: 'video-annotation/pending'
        }
      },
    
      fn: async function (inputs) 
      {
            var newTask = await PendingTask.create(inputs).fetch();
            await UserService.notifySubscribed(newTask);

            var pTasks = await PendingTask.find({lang:this.req.session.User.firstLangISO});

            return {pTasks:pTasks};
      }
    
};
  