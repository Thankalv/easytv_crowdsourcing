module.exports = {

    friendlyName: 'Update the confidence of a user on a certain language',
    description: "This is an Admin-restricted functionality",

    inputs: {
      id: {
        description: 'The id of the admin organisation',
        type: 'string',
      },
      user_id: {
        description: 'The id of the user to update',
        type: 'string',
        required: true,
      },
      lang: {
        description: 'The language code',
        type: 'string',
        required: true,
      },
      level: {
        description: 'The level of confidence',
        type: 'string',
        required: true,
      }
    },
  
    exits: {
        success: {
          statusCode: 200,
          description: "User's confidence level was updated!"
        },
        noAccess: {
          statusCode: 401,
          description: 'You cannot modify this user confidence',
        },
        notFound: {
          statusCode : 404,
          description: "The requested user was not found"
        }
      },

    fn: async function (inputs, exits) 
    {
      sails.log(inputs);
      if(this.req.session.User.access=="admin")
      {
        var user2update = await User.findOne(inputs.user_id).populate("userOrganisation");;
        var lang_info = await UserService.updateLangLevel(user2update, inputs.lang, inputs.level);

        await User.updateOne(inputs.user_id)
                  .set({lang_info: lang_info })
                  .intercept( ()=>{ return exits.notFound(); })

        return exits.success({code:200, description:"Successfully changed user-confidence"});
      }  
    }
};
  