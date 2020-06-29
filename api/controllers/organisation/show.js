module.exports = {

    friendlyName: 'Show an organisation',
    description: "Show & edit page for managing/editing organisations' options",
  
    inputs: {
        id: {
          description: 'The id of the organisation to show',
          type: 'string',
        },
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'display the organisation configuration',
        viewTemplatePath: 'organisation/show'
      }
    },
  
    fn: async function (inputs, exits) 
    {
        var orgid = inputs.id;
        sails.log(orgid);

        if (!orgid){
          FlashService.error(this.req, 'no parameter id was found.');
          return this.res.redirect('/');
        }
        else{
          var existingOrg = await Organisation.findOne( orgid ).populate("voluntManager");
          if (!existingOrg)
            return this.res.notFound('The provided org-id is does not exist!');

          if(!existingOrg.api_info){  
            var updOrg = await Organisation.updateOne({ id: inputs.id })
                .set({api_info:
                  { "headerName": "NOT_EXIST",
                    "headerToken": "NOT_EXIST",
                    "getJobsURL": "NOT_EXIST",
                    "postUserJob": "NOT_EXIST"}
                });
            return exits.success({organisation: updOrg});
          }
          var orgAdmins = await User.find({access:"admin", userOrganisation:orgid});
          existingOrg.admins = orgAdmins;
          
          return exits.success({
            langs: sails.config.custom.langs,
            langsISO: sails.config.custom.langsISO,
            organisation: existingOrg
          });
        }
    }  
};
  