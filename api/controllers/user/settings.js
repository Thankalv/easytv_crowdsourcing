module.exports = {

    friendlyName: 'Change user settings',
  
    inputs: {
    },

    exits: {
        success: {
          statusCode: 200,
          description: 'show the user/settings page.',
          viewTemplatePath: 'user/settings'
        },
    
      },

    fn: async function (inputs, exits) 
    {
      // sails.log(this.req.session.User);

      return exits.success({ user: this.req.session.User});

    }
  
  
  };