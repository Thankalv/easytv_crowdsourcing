module.exports = {

    friendlyName: 'Demo video-annotation app',
    
    exits: {
  
      success: {
        statusCode: 200,
        description: 'show the demo video-annotation.',
        viewTemplatePath: 'video-annotation/demo'
      },
  
    },
  
    fn: async function () 
    {
        return { };
    }
  
  };
  