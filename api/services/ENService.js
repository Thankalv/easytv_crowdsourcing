
/**
 * Service to notify the registered Volunteers (and copy to the Volunteer Mananger)
 * @param   {ObjectId}  newVolunteer      object of User
 */
exports.sendEN = async function(newVolunteer, EN, lang)
{
  var langs = sails.config.custom.langs;
  var langsISO = sails.config.custom.langsISO;
  if(newVolunteer.userOrganisation.voluntManager)
    var adminCC = await User.findOne(newVolunteer.userOrganisation.voluntManager);
  else 
    var adminCC ="admin@example.com"
  if(EN==1)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + ' - Thanks for your registration',
        template: 'email-en1',
        templateData: {
          fullName: User.fullName(newVolunteer),
          en1_text: newVolunteer.userOrganisation.en1,
          orgName : newVolunteer.userOrganisation.name
        }
      });
    if(EN==2)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + ' - Testing phase for '+langs[langsISO.indexOf(lang)]+' language',
        template: 'email-en2',
        templateData: {
          fullName: User.fullName(newVolunteer),
          en2_text: newVolunteer.userOrganisation.en2,
          orgName : newVolunteer.userOrganisation.name
        }
      });
    if(EN==2.5)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + ' - '+ langs[langsISO.indexOf(lang)] +' test ready' ,
        template: 'email-en25',
        templateData: {
          fullName: User.fullName(newVolunteer),
          en25_text: newVolunteer.userOrganisation.en25,
          orgName : newVolunteer.userOrganisation.name
        }
      });
    if(EN==3)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + ' - '+ langs[langsISO.indexOf(lang)] +' validation phase is passed!' ,
        template: 'email-en3',
        templateData: {
          fullName: User.fullName(newVolunteer),
          userid: newVolunteer.id,
          token: newVolunteer.reg2_token,
          orgid: newVolunteer.userOrganisation.id,
          en3_text: newVolunteer.userOrganisation.en3,
          orgName : newVolunteer.userOrganisation.name,
          lang: lang
        }
      });
    if(EN==4)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + " - "+ langs[langsISO.indexOf(lang)] +" evalutions's 2nd part of registration is complete!",
        template: 'email-en4',
        templateData: {
          fullName: User.fullName(newVolunteer),
          en4_text: newVolunteer.userOrganisation.en4,
          orgName : newVolunteer.userOrganisation.name
        }
      });
    if(EN==5)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + ' - '+ langs[langsISO.indexOf(lang)] +' validation phase seems to have failed!' ,
        template: 'email-en5',
        templateData: {
          fullName: User.fullName(newVolunteer),
          en5_text: newVolunteer.userOrganisation.en5,
          orgName : newVolunteer.userOrganisation.name
        }
      });
    if(EN==6)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + ' - '+' Good Bye!' ,
        template: 'email-en6',
        templateData: {
          fullName: User.fullName(newVolunteer),
          en6_text: newVolunteer.userOrganisation.en6,
          orgName : newVolunteer.userOrganisation.name
        }
      });
    if(EN==7)
      await sails.helpers.sendTemplateEmail.with({
        to: newVolunteer.email,
        cc: adminCC.email,
        subject: newVolunteer.userOrganisation.name + ' - '+ langs[langsISO.indexOf(lang)] +' archive content is passed!' ,
        template: 'email-en7',
        templateData: {
          fullName: User.fullName(newVolunteer),
          en7_text: newVolunteer.userOrganisation.en7,
          orgName : newVolunteer.userOrganisation.name
        }
      });
};

