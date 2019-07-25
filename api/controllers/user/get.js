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
      users = await User.find();
      return exits.success(users);
    }
  
};