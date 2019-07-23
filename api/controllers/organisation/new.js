module.exports = {

    friendlyName: 'Register new organisation',
  
    description: 'Show the organisation/new form page.',
  
    exits: {
  
      success: {
        statusCode: 200,
        description: 'display the organisation/new form page.',
        viewTemplatePath: 'organisation/new'
      },
  
    },
  
    fn: async function () 
    {
        //sails.log.debug( newLog );
        return { };
    }
  
  };
  