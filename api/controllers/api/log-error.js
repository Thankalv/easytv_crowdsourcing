
module.exports = {

    friendlyName: 'Log an error',
  
    description: 'Log an error-event encountered by a logged user',
  
    inputs: {

     errorName: {
         type: 'string',
         required: true,
        },
        description: {
         type: 'string',
         required: true,
        },
    },
  
    exits: {
      success: {
        description: "ErrorLog recorded in the database"
      },

      notFound: {
        statusCode : 500,
        description: "ErrorLog NOT recorded"
      },

    },

    fn: async function (inputs, exits) {

      sails.log(inputs);
    
      var errLog = await ErrorEvent.create({ errorName: inputs.errorName, description: inputs.description, occurredTo:this.req.session.User.id }).fetch();

      if(errLog)
        return exits.success({code:200, description: 'ErrorLog recorded'});
      else
        return exits.notFound({code:500,  description: 'ErrorLog NOT recorded in the database'});
    }
  
  };
  