module.exports = {

    friendlyName: 'Unblock a user',
    
    inputs: {
      id: {
        description: 'The id of the admin organisation',
        type: 'string',
      },
      user: {
        description: 'The user id',
        type: 'string',
      },
    },
  
    exits: {
        success: {
          statusCode: 200,
          description: 'user access is restored'
        },
    
      },

    fn: async function (inputs, exits) 
    {
        var userId = inputs.user;
        if (!userId) {
          FlashService.error(this.req, 'UserId parameter not found.');
          return this.res.redirect('/');
        } 
        else 
        {
          var org = await Organisation.findOne(inputs.id);
          if (!org) {
            return this.res.notFound('Organisation not found.');
          } 

          // remove the user from the block-list
          var index = org.blocked.users.indexOf(userId);
          if (index > -1) {
            org.blocked.users.splice(index, 1);
          }

          await Organisation.updateOne({ id: org.id }).set({blocked:org.blocked});
          //sails.log(org);

          return exits.success();

        }
    }
  
  
  };
  