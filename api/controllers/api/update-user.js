module.exports = {

    friendlyName: 'update a user-record',
    description: "super-admin only - token protection",

    inputs: {
      id: {
        description: 'The id of the user to update',
        type: 'string',
        required: true
      },
      lastName: {
        description: 'the lastName of the user',
        type: 'string',
      },
      firstName: {
        description: 'the firstName of the user',
        type: 'string',
      },
      email: {
        description: 'the main email of the user',
        type: 'string',
      },
      phone_num: {
        description: 'the tel. number of the user',
        type: 'string',
      },
      description: {
        description: 'a short description/bio of the user',
        type: 'string',
      },
      password: {
        description: 'new password of the user',
        type: 'string',
      },
      confirmation: {
        description: 'new password of the user',
        type: 'string',
      },
      userOrganisation: {
        description: 'change the id of the registered org',
        type: 'string',
      },
      lang_info:{
        description: "users language level",
        type: "json"
      }
    },

    exits: {
        success: {
          statusCode: 200,
          description: "User's record was updated!"
        },
      },

    fn: async function (inputs, exits) 
    {
        var user2update = await User.findOne(inputs.id);
        if (!user2update) {
            return this.res.notFound('User-id not found.');
        } 
        else 
        {
          // update the user's role in the database
          var updUser = await User.updateOne({ id: inputs.id }).set(inputs)
                                .intercept( (err)=>{ return exits.serverError({code:-500, description: err.details})} );
          if(!updUser)
            return this.res.notFound('User-id not found.');    
          sails.log("Updated user: "+updUser.email);
          return exits.success({description:"Updated: "+updUser.email});
        }
    }  
};
  