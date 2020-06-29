module.exports = {

    friendlyName: 'modify a user-status',
    description: "an authenticated client can modify",

    inputs: {
      id: {
        description: 'The id of the user to modify',
        type: 'string',
        required: true
      },
      trustlevel: {
        description: 'a number indicating the new level of the user',
        type: 'number',
      },
      langCode: {
        description: 'The language code to modify',
        type: 'string',
        required: true
      }
    },
    exits: {
        success: {
          statusCode: 200,
          description: "User's level was updated!"
        },
        serverError: {
            statusCode: 500,
            description: 'Error occurred in server.',
          }
      },

    fn: async function (inputs, exits) 
    {
        var user2update = await User.findOne(inputs.id).populate('userOrganisation');
        if (!user2update) {
            return this.res.notFound('User-id not found.');
        } 
        else{
          // update the user's trustlevel for a certain language
          var lang_info = await UserService.updateLangLevel(user2update, inputs.langCode, inputs.trustlevel);
          //sails.log(user2update);

          user2update = await User.updateOne(inputs.id).set({lang_info:lang_info})
                                    .intercept(  (err)=>{  return exits.serverError({code:-500, description: err.details}); });
          if(!user2update)
            return this.res.notFound('User-id not found.');    
          sails.log("Updated user: "+user2update.email);
          return exits.success({description:"User's level was updated successfully: "+user2update.email});
        }
    }  
};
  