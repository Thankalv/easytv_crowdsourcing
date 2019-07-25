module.exports = {

    friendlyName: 'GET organisations registered',
    description: "SuperAdmin API endpoint for DB check",
    inputs: {
        users: {
            description: 'if true populate org-users',
            type: 'boolean',
        }
    },

    exits: {
        success: {
          statusCode: 200,
          description: 'send json with organisations'
        },
      },

    fn: async function (inputs, exits) 
    {
        if(inputs.users == true)
            orgs = await Organisation.find().populate("users");
        else
            orgs = await Organisation.find();

        return exits.success(orgs);
    }
  
};