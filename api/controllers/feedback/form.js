module.exports = {

    friendlyName: 'Feedback',
  
    description: 'Display the feedback form to a logged user',
  
    exits: {
  
      success: {
        statusCode: 200,
        description: 'show the feedback page.',
        viewTemplatePath: 'feedback'
      },
  
    },
  
    fn: async function () 
    {
        return { };
    }
  
  };
  