module.exports = {

      friendlyName: 'Submit video to pending task',
      
      inputs: {
        id: {
            type: 'string',
            required: true,
            description: "id of the task to submit"
        }
      },
    
      exits: {
        success: {
          statusCode: 200,
          description: 'display the video-uploading page',
          viewTemplatePath: 'video-annotation/new-video'
        },
      },
    
      fn: async function (inputs) 
      {
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;
    
        newVid = await PendingTask.findOne(inputs.id);
        sails.log(newVid);

        return { videoAnnot: newVid};
      }
    
    };
    