module.exports = {

    friendlyName: 'Update user settings',
  
    inputs: {
        emailNewJob: {
            type: 'string',
            required: true,
        },
        emailRejectJob: {
            type: 'string',
            required: true,
        },
        showOtherJobs:{
          type: 'string',
          required: true,
      },
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
      sails.log(inputs);
      var updUser = await User.updateOne({ id: this.req.session.User.id }).set({settings: inputs});
      if(!updUser)
        return this.res.notFound('User-id not found.');
      this.req.session.User.settings = updUser.settings;

      FlashService.success(this.req, 'Settings updated!');
      return this.res.redirect("/user/settings");

    }
  
  
  };