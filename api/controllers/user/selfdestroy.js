
module.exports = {

    friendlyName: 'A user deletes its own account',
  
    inputs: {
      id: {
        description: "The id of the user to be deleted",
        type: 'string',
        required: true
      },   
    },
    exits: {
        serverError: {
            statusCode: 500,
            description: 'Error occurred in server.',
          },
      },

    fn: async function (inputs, exits) 
    {
        //var referer = this.req.header('Referer') || '/';
        var userId = inputs.id;
        var user = await User.findOne(userId);

        if (!user) {
          FlashService.error(this.req, 'User not found.');
          return this.res.redirect('/');
        }
        else {
          await Accesslink.destroy({user: user.id});
          // mark this user's stats-records as 'rejected'
          await UserJobStats.update({ worker: userId}).set({status:'Rejected'});

          sails.log.warn('User <'+user.email+'> is deleted!');
          await User.destroyOne(userId)
            .intercept( (err)=>{
              FlashService.error(this.req, err.details); ; 
              return exits.serverError({description: err.details});
            })
          if(userId==this.req.session.User.id)
            this.req.session.destroy();
          return this.res.redirect('/users');
        }
    }  
};