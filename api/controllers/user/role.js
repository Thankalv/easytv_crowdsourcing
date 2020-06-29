module.exports = {

    friendlyName: 'Update the role of a user [reviewer,evaluator,admin]',
    description: "ONLY an Organisation-Admin can modify users' role",

    inputs: {
      id: {
        description: 'The id of the admin organisation',
        type: 'string',
      },
      user: {
        description: 'The id of the user to update',
        type: 'string',
        required: true,
      },
      role: {
        description: 'The tag of the role',
        type: 'string',
        required: true,
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: "User's role was modified!"
      }
    },

    fn: async function (inputs, exits) 
    {
      var userId = inputs.user;
      if (!userId) {
          return this.res.notFound('User-id not found.');
      } 
      else 
      {
        var org = await Organisation.findOne(inputs.id);
        if (!org) {
          return this.res.notFound('Organisation not found.');
        }
        // update the user's role in the database
        var updUser = await User.updateOne({ id: inputs.user }).set({access: inputs.role});
        if(!updUser)
          return this.res.notFound('User-id not found.');
        
        if(updUser.access=="reviewer"){
          await sails.helpers.sendTemplateEmail.with({
            to: updUser.email,
            subject: 'User-role upgrade!',
            template: 'email-role-upgrade',
            templateData: { fullName: User.fullName(updUser), newRole: sails.config.custom.broadcasterRoles[updUser.access.toLowerCase()] }
          });
          updUser.lang_info = await UserService.updateLangEvaluator(updUser);
          await User.updateOne({ id: updUser.id }).set(updUser);
          await Log.create({user: this.req.session.User.id , activity:"Admin has upgraded user "+updUser.email + " to Evaluator-role" });
        }
        return exits.success();
      }
    }  
};
  