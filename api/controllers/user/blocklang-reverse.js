module.exports = {

    friendlyName: 'Reverse language block of a user',

    inputs: {
      id: {
        description: "The id of the admin's organisation",
        type: 'string',
      },
      user: {
        description: "The id of the user to unblock",
        type: 'string',
      },
      langCode: {
        description: "the language code to unblock",
        type: 'string',
      },
    },
    exits: {
        success: {
          statusCode: 200,
          description: 'user can now access this language'
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
      }else{
          var org = await Organisation.findOne(inputs.id);
          if (!org) {
            return this.res.notFound('Organisation not found.');
          } 
          // check if user currently still exists (to avoid the case that was deleted in the meantime)
          var user2block = await User.findOne(userId);
          if(!user2block){
            sails.log("No user found!!!");
            FlashService.error(this.req, 'User was not found registered.');
            return exits.notFound();
          }
          // make this user unable to access per-language
          user2block.lang_info = await UserService.unblockLang(user2block, inputs.langCode);
          // delete userObj.confirmation;
          // console.log(req.param('id'));
          updUser = await User.updateOne(userId)
              .intercept( ()=>{ return exits.notFound(); })
              .set(user2block);

          var unblockLog = await BlockEvent.create({  blockType: "reverse per-language block", 
              description: "Reversed blocking in language: '"+inputs.langCode+"'", 
              occurredTo: updUser.id,
              adminBy: this.req.session.User.id }).fetch();

          // sails.log(unblockLog);
          return exits.success();
      }
    }
  };
  