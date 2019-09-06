/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …

  // a simple config variable to control the 'logging' mode of the setup
  loggingMode : true,

  // Send "confirm account" email to assure a human user
  verifyEmailAddresses : true,

  // config var to be exposed in email-templates
  baseUrl: process.env.BASE_URL || 'http://localhost:1337',

  adminKey: process.env.ADMIN_KEY,
  
  /* easytv authentication token for the API modules intercommunication */
  xEasyTVtoken: "dea005f1143a6626be48e2d4878ecf8538a5dde78996fb673c9663bcb1be5390",
  
  version: 0.5,
  // confirm-email expires in only 1 minute
  emailProofTokenTTL:    24*60*60*1000,// 24 hours

  langs: ['English', 'Spanish', 'Catalan', 'Italian', 'Arabic', 'Berber'],
  langsISO : ['en', 'es', 'ca', 'it', 'ar', 'bb'],

  broadcasterRoles: {"editor": "reviewer", "reviewer": "evaluator", "admin":"admin", "superadmin": "superadmin"},

  LEVELS: {"low": 1, "mid": 2, "high": 3, "professional":4 }
 

};
