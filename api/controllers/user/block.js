module.exports = {

    friendlyName: 'Block a user',
    
    inputs: {
      id: {
        description: 'The id of the admin organisation',
        type: 'string',
      },
      user: {
        description: 'The id of the admin organisation',
        type: 'string',
      },
    },
  
    exits: {
        success: {
          statusCode: 200,
          description: 'user is added to the block-list'
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

          // add the user to the block-list
          var index = org.blocked.users.indexOf(userId);
          if (index <0 ) {
            org.blocked.users.push(userId);
          }
          
          await Organisation.updateOne({ id: org.id }).set({blocked:org.blocked});
          //sails.log(org);

          return exits.success();

        }
    }
  
  
  };
  