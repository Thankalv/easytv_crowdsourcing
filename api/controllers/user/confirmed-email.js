module.exports = {

  friendlyName: 'User just confirmed her/his email',
  inputs: {
  },

  exits: {
      success: {
        statusCode: 200,
        description: 'returns a greeting page',
        viewTemplatePath: "user/confirmed-email"
      },
    },

  fn: async function (inputs, exits) 
  {
    return exits.success();
  }

};