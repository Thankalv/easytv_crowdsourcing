module.exports = {

    friendlyName: 'Block a user',

    inputs: {
      id: {
        description: "The id of the admin's organisation",
        type: 'string',
      },
      user: {
        description: "The id of the user to block",
        type: 'string',
      },
      langCode: {
        description: "the language code to block",
        type: 'string',
      },
    },
    exits: {
        success: {
          statusCode: 200,
          description: 'user is blocked on this language'
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
      else{
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
          user2block.lang_info = await UserService.blockLang(user2block, inputs.langCode);
          // delete userObj.confirmation;
          // console.log(req.param('id'));
          var updUser = await User.updateOne(userId)
            .intercept( ()=>{ return exits.notFound(); })
            .set(user2block);

          var blockLog = await BlockEvent.create({  blockType: "per-language block", 
                                                    description: "Blocking in language: '"+inputs.langCode+"'", 
                                                    occurredTo: updUser.id,
                                                    adminBy: this.req.session.User.id })
                                                    .fetch();
          sails.log(blockLog);
          return exits.success();
      }
    }
  };
  