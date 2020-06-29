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
  // a simple config variable to control the 'logging' mode of the setup
  loggingMode : true,

  // Send "confirm account" email to assure a human user
  verifyEmailAddresses : true,

  // access API from admin-key
  adminKey: process.env.ADMIN_KEY || "admin-12345",
  
  // access API from admin-key
  isDocker: process.env.IS_DOCKER || "NO",

  // admins manage all confidence-level
  confLevel: process.env.MANAGE_LEVEL || "YES",
  
  // restore the back-up file of the destroyed orgs
  restoreOrgs: process.env.RESTORE_ORGS || "NO",

  // force older testing user to become "email-confirmed"
  forceConfirmed: process.env.FORCE_CONFIRM || "NO",

  // config var to be exposed in email-templates
  baseUrl: process.env.BASE_URL || 'http://localhost:1337',

  // our AWS repo base-url
  AWSurl:  "https://easytv-repo-sl.s3.amazonaws.com/",

  video_directory: 'video-submits/',
  mocap_directory: 'mocap-submits/',

  /* easytv authentication token for the API modules inter-communication */
  xEasyTVtoken: "dea005f1143a6626be48e2d4878ecf8538a5dde78996fb673c9663bcb1be5390",
  version: 0.5,
  // confirm-email expires in only 1 minute
  emailProofTokenTTL:  72*60*60*1000,// 24 hours

  ontologyLangs: ['English', 'Spanish', 'Italian', 'Greek'],
  ontologyLangsISO: ['en', 'es', 'it', 'el'],

  langs: ['English', 'Spanish', 'Catalan', 'Arabic', 'Berber'],
  langsISO : ['en', 'es', 'ca', 'ar', 'bb'],

  broadcasterRoles: {"editor": "reviewer", "reviewer": "evaluator", "admin":"admin", "superadmin": "superadmin"},

  LEVELS: {"low": -1, "mid": 1, "high": 5, "professional": 9 },

  /* Levels for registration workflow -- as suggested by the broadcaster*/
  // 'validation pending' is for a fresh member (no visibility)
  // 'test' is for a user that has only "test content" visibility
  confidence_level: {"-2":"validation pending", "-1":"test", "0":"suitable"},

  workflow_levels: {  "-3": "NOT SUITABLE", "-2": "Pending Evaluation", "-1": "Under Evaluation",  0 : "Suitable",
                       1 : 'Archive', 2: 'Archive+', 3: 'Archive++', 4 : 'Archive+++', 
                       5: 'Broadcast', 6: 'Broadcast+', 7: 'Broadcast++', 8: "Broadcast+++", 9:"Professional"},

};