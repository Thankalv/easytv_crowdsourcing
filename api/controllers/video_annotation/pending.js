module.exports = {

    friendlyName: "Pending tasks for user's Sign Language",
    
    inputs: {
    },

    exits: {
      success: {
        statusCode: 200,
        description: "display to the user pending concepts in user's Sign Language",
        viewTemplatePath: 'video-annotation/pending'
      }
    },
  
    fn: async function (inputs) 
    {
      var pTasks = await PendingTask.find({lang:this.req.session.User.firstLangISO});

      var notEmpty = [];
      await _.each(pTasks, function(task) 
      {
        if (task.wle!="" || task.sle!="" || task.videoURL!="")
          notEmpty.push(task)
      });

      return {pTasks:notEmpty};    
    }
  
};
