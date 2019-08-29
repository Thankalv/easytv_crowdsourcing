module.exports = {

    friendlyName: 'Update the confidence of a user on a certain language',
    description: "This is an Evaluator-restricted functionality",

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
      },
      job_id: {
        description: 'The job under evaluation',
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
      var isJobUnderReview = await Accesslink.findOne({user: this.req.session.User.id, job_id: inputs.job_id})
      if(this.req.session.User.access=="reviewer" && isJobUnderReview)
      {
        var user2update = await User.findOne(inputs.user_id);
        // find the lang-code and update the level
        var counter = 0;
        await _.each(user2update.lang_info.langs, function(userLang) {
            if( userLang['lang'+counter] == inputs.lang)
              userLang['level'+counter] = inputs.level;
            counter++;
        });

        await User.updateOne(inputs.user_id)
          .intercept( ()=>{ return exits.notFound(); })
          .set(user2update);

        return exits.success({code:200, description:"Successful user-confidence update"});
      }
      else
      {
        FlashService.error(this.req, 'You cannot access the users of this job!');
        return exits.noAccess();
      }
      
    }
  };
  