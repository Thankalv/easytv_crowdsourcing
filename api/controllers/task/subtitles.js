
module.exports = {

    friendlyName: 'Display subtitle tasks',
  
    description: "Display registered (active/inactive) subtitle tasks \
                according to what broadcaster the user belongs",
  
    inputs: {
  
    },


    fn: async function (inputs, exits) 
    {
        //sails.log(inputs)
        var ownedSubttitles = await Task.find( {content_owner: this.req.session.User.userOrganisation.id});

        //sails.log(ownedSubttitles);
        
        return this.res.view({subz: ownedSubttitles})
    }
  
  
  };
  