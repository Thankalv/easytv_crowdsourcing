
var moment = require("moment");

module.exports = {

    friendlyName: 'Api version',
  
    description: 'Return the current api-version',
  
    inputs: {
    },
  
    exits: {
      success: {
        description: "Api-version is returned"
      },
    },

    fn: async function (inputs, exits) 
    {
        return exits.success({version:"0.5", serverlocaltime: moment().format('LLLL')});
    }
  
  };
  