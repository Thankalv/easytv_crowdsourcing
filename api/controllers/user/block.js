module.exports = {

    friendlyName: 'Block a user',

    inputs: {
      id: {
        description: "The id of the admin's organisation",
        type: 'string',
      },
      user: {
        description: "The id of the admin's organisation",
        type: 'string',
      },
      reason: {
        description: "The reason behind this blocking",
        type: 'string',
      },
    },
    exits: {
        success: {
          statusCode: 200,
          description: 'user is added to the block-list'
        },
        notFound: {
          statusCode : 404,
          description: "The requested user was not found"
        },
      },

    fn: async function (inputs, exits) 
    {
      var userId = inputs.user;
      if (!userId) {
        FlashService.error(this.req, 'UserId parameter not found.');
        return exits.notFound();
      } 
      else 
      {
        var org = await Organisation.findOne(inputs.id);
        if (!org) {
          return this.res.notFound('Organisation not found.');
        } 

        // check if user is currently exists (to avoid the case that was deleted)
        var user2block = await User.findOne(userId);
        if(!user2block){
          sails.log("No user found!!!");
          FlashService.error(this.req, 'User was not found registered.');
          return exits.notFound();
        }
        // add the user to the org's block-list
        var index = org.blocked.users.indexOf(userId);
        if (index <0 ) {
          org.blocked.users.push(userId);
        }
        await Organisation.updateOne({ id: org.id }).set({blocked: org.blocked});
        await sails.helpers.sendTemplateEmail.with({
            to: user2block.email,
            subject: 'Your profile was blocked',
            template: 'email-blocked-user',
            templateData: {
              fullName: User.fullName(user2block),
              reason: inputs.reason,
              orgName:  org.name
            }
        });
        //sails.log(org);
        return exits.success();
      }
    }
  };
  