
module.exports = {

    friendlyName: 'A user deletes a user account',
  
    inputs: {
      id: {
        type: 'string',
        required: true,
        description: "The id of the user to destroy"
      }    
    },
    exits: {
      success: {
        statusCode : 200,
        description: "The user was removed successfully"
      },
      serverError: {
            statusCode: 500,
            description: 'Error occurred in server.',
          },
      },

    fn: async function (inputs, exits) 
    {
        var userId = inputs.id;
        var user = await User.findOne(userId);

        if (!user) {
          FlashService.error(this.req, 'User not found.');
          return exits.success();
        }
        else {
          await Accesslink.destroy({user: userId});
          // mark this user's stats-records as 'rejected'
          await UserJobStats.update({ worker: userId, status: { '!=' : 'Rejected'}}).set({status:'Rejected'});

          sails.log.warn('User <'+user.email+'> is deleted!');
          await User.destroyOne(userId)
                    .intercept( (err)=>{
                      FlashService.error(this.req, err.details); ; 
                      return exits.serverError({description: err.details});
                    })
          return exits.success();
        }
    }  
};