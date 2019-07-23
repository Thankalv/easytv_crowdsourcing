
var ISO6391 = require('iso-639-1');

module.exports = {

    friendlyName: 'Edit a user',
    
    inputs: {
      id: {
        description: 'The id of the user to edit',
        type: 'string',
      },
    },
  
    exits: {
        success: {
          statusCode: 200,
          description: 'show the user/edit page.',
          viewTemplatePath: 'user/edit'
        },
    
      },

    fn: async function (inputs, exits) 
    {
        var userId = inputs.id;
        var referer = this.req.header('Referer') || '/';
        // sails.log(referer);
    
        if (!userId) {
          FlashService.error(this.req, 'UserId parameter not found.');
          return this.res.redirect('/');
        } 
        else 
        {
          var user = await User.findOne(userId).populate('userOrganisation');
          if (!user) {
            return this.res.notFound('User not found.');
          } 

          var organisations = await Organisation.find();
          if (organisations.length == 0) {
            return this.res.notFound('No organisations are registered in the platform!');
          } 

          return exits.success({
            user: user,
            organisations: organisations,
            referer: referer,
            langs: ISO6391.getAllNames(),
            langsISO: ISO6391.getAllCodes(),
            levels: [   { num: 1, description: 'Junior'},
                      { num: 2, description: 'Intermediate'},
                      { num: 3, description: 'Proficiency'}]
          });

        }
    }
  
  
  };
  