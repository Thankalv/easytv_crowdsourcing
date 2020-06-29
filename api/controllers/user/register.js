
module.exports = {

    friendlyName: 'Prepare the member-register page',
    description: "Each organisation has its own 'register parameters', render accordingly",
    inputs: {
        orgid: {
        description: 'The id of the organisation to render',
        type: 'string',
      },
    },
    exits: {
        success: {
          statusCode: 200,
          description: 'render the user/register page.',
          viewTemplatePath: 'user/register'
        },
    },
    fn: async function (inputs, exits) 
    {
        var orgId = inputs.orgid;
        var defaultLang = "";
        var organisations = await Organisation.find({name:{"!=":"Default"}}).intercept((err)=>{ return this.res.notFound(); });
        if (organisations.length == 0) {
            sails.log.error(err);
            return this.res.notFound();
        }
        
        // var default_organisation_id = organisations[0].id;
        var default_organisation_id = 000;
        if (orgId) {
            var orgExists = await Organisation.findOne(orgId);
            if(orgExists){
                default_organisation_id = orgId;
                if(orgExists.preReqLang)
                    defaultLang = orgExists.preReqLang;
                    defaultLanguage = sails.config.custom.langs[sails.config.custom.langsISO.indexOf(defaultLang)];
            }
            else{
                FlashService.error(this.req, "This organisation does not exist!"); 
                return this.res.redirect("/user/register");
            }
        }
        else{
            await _.each(organisations, function(org) {
                if (org.name == 'CCMA'){
                    default_organisation_id = org.id;
                    defaultLang = "ca";
                    defaultLanguage = sails.config.custom.langs[sails.config.custom.langsISO.indexOf(defaultLang)];
                }
            });
        }
        var selectLangs = [], selectLangsISO = [];
        await _.each(sails.config.custom.langsISO, function(lang) {
            if (lang != defaultLang){
                selectLangsISO.push(lang);
                selectLangs.push(sails.config.custom.langs[sails.config.custom.langsISO.indexOf(lang)]);
            }
        });

        return exits.success({
            orgid: default_organisation_id,
            organisations: organisations,
            defaultLang: defaultLang,
            defaultLanguage: defaultLanguage,
            langs: selectLangs,
            langsISO: selectLangsISO,
            levels: [ { num: 1, description: 'Junior'},
                      { num: 2, description: 'Intermediate'},
                      { num: 3, description: 'Proficiency'}] ,
            allow_mods: false,
            user: null
          });
    }  
};
  