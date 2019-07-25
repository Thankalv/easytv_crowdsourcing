/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/
  // '*': true,

  '*' : ['flash'],

  task:{
    '*' : ['sessionAuth', 'superadmin'],
    'assign': ['sessionAuth'],
    'refreshtoken':  ['sessionAuth']
  },

  session: {
    'display': ['sessionAuth'],
  },

  log: {
    'index': ['sessionAuth'],
  },

  feedback:{
    '*' : ['sessionAuth'] 
  },

  api:{
    'available-subt': ['xEasyTv'],
    'cancel-subt': ['xEasyTv'],
    'reject-subt':  ['xEasyTv'],
    'update-subt':  ['xEasyTv'],
    'confirm-subt': ['xEasyTv'],
    'reviewerstats-subt': ['xEasyTv'],
    'editorstats-subt': ['xEasyTv'],
    // api endpoint for users logging error
    'log-error': ['sessionAuth'],
    'api-version': true
  },

  video_annotation:{
    "*": ['sessionAuth']
  },

  organisation:{
    '*' : ['sessionAuth', 'superadmin'],
    "new": ['flash',"sessionAuth",'superadmin'],
    "create": ['flash',"sessionAuth",'superadmin'],
    "show": ['flash',"sessionAuth",'admin'],
    "refreshtoken": ['admin',"sessionAuth"],
    "update": ['sessionAuth',"admin"],
    "api-info": ['admin',"sessionAuth"]
  },

  user:{
    "*": ['superadmin'],
    "index" : ['sessionAuth'],
    "get": ["sessionAuth", "superadmin"],
    "edit" : ['sessionAuth', 'sameOrg', 'flash'],
    "update": ['sessionAuth', 'sameOrg', 'flash'],
    "settings" : ['sessionAuth', 'flash'],
    "settingsupdate" : ['sessionAuth', 'flash'],
    "newuser": ['flash'],
    "block": ["flash","sessionAuth", "admin"],
    "unblock":  ["flash","sessionAuth", "admin"],
    "role":  ["flash","sessionAuth", "admin"],
    "register": ['flash'],
    "signup": ['flash'],
    "list": ['sessionAuth'],
    "confirmed-email":  ['flash', 'sessionAuth'],
    "exportfile": ['sessionAuth'],
    "destroy": ['userCanSeeProfile']
  }

};
