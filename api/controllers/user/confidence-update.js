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
        var lang_info = await UserService.updateLangLevel(user2update, inputs.lang, inputs.level);
        await User.updateOne(inputs.user_id)
              .set({lang_info: lang_info })
              .intercept( ()=>{ return exits.notFound(); })

        await Log.create({user: this.req.session.User.id , activity:"Evaluator has updated the lang-level of "+user2update.email + " to " + inputs.level + " for job-"+inputs.job_id });
        return exits.success({code:200, description:"Successful user-confidence update"});
      }
      else
      {
        FlashService.error(this.req, 'You cannot access the users of this job!');
        return exits.noAccess();
      }
      
    }
  };
  