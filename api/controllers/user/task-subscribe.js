module.exports = {

    friendlyName: 'User will get email notification after a new subscription',

    inputs: {
      lang: {
        description: 'The lang about which tasks to subscribe',
        type: 'string',
        required: true,
      },
    },
    exits: {
      success: {
        statusCode: 200,
        description: "User's role was subscribed!"
      }
    },

    fn: async function (inputs, exits) 
    {
        await Subscribed.create({lang:inputs.lang, createdBy: this.req.session.User.id})
        return exits.success();
    }  
};
  