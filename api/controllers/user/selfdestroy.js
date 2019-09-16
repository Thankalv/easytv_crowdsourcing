
module.exports = {

    friendlyName: 'A user deletes its own account',
    
    inputs: {

    },
  
    exits: {
        serverError: {
            statusCode: 500,
            description: 'Error occurred in server.',
          },
      },

    fn: async function (inputs, exits) 
    {
        var userId = this.req.session.User.id;
        var referer = this.req.header('Referer') || '/';
        var user = await User.findOne(userId);

        // sails.log(referer);
        if (!user) {
          FlashService.error(this.req, 'User not found.');
          return this.res.redirect('/');
        }
        else {
          await Accesslink.destroy({user: user.id});
          // mark this user's stats-records as 'rejected'
          await UserJobStats.update({ worker: userId, status: { '!=' : 'Rejected'}}).set({status:'Rejected'});

          sails.log.warn('User <'+user.email+'> is deleted!');
          await User.destroy(userId)
            .intercept( (err)=>{
              FlashService.error(this.req, err.details); ; 
              return exits.serverError({description: err.details});
            })
          this.req.session.destroy();
          return this.res.redirect('/users');
        }
    }
  
  
  };