module.exports = {

  friendlyName: 'GET users registered',
  description: "SuperAdmin API",
  inputs: {
  },
  exits: {
      success: {
        statusCode: 200,
        description: 'send json with users'
      },
    },

  fn: async function (inputs, exits) 
  {
    if(this.req.session.User.access=="superadmin")
      users = await User.find();
    else
      users = await User.find({userOrganisation:inputs.id});

    return exits.success(users);
  }
}