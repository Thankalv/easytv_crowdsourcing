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
    'unassign': ['sessionAuth'],
    'refreshtoken':  ['sessionAuth']
  },

  session: {
    "display": ['sessionAuth'],
    // "userdestroy": [ 'sessionAuth', 'userCanSeeProfile']
  },

  accesslink: {
    "*": ['adminkey']
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
    'log-error': ['sessionAuth'],
    'update-user': ['adminkey'],
    'api-version': true
  },

  video_annotation:{
    "*": ['sessionAuth']
  },

  organisation:{
    '*' : ['adminkey'],
    "new": ['flash',"sessionAuth",'superadmin'],
    "create": ['flash',"sessionAuth",'superadmin'],
    "show": ['flash',"sessionAuth",'admin'],
    "refreshtoken": ['sessionAuth',"admin"],
    "update": ['sessionAuth',"admin"],
    "api-info": ['sessionAuth',"admin"]
  },

  userjobstats:{
    "*": ["adminkey"]
  },

  user:{
    "*": ['adminkey'],
    "index" : ['sessionAuth'],
    "get": ["sessionAuth", "admin"],
    "edit" : ['sessionAuth', 'sameOrg', 'flash'],
    "update": ['sessionAuth', 'sameOrg', 'flash'],
    "settings" : ['sessionAuth', 'flash'],
    "confidence-review": ['sessionAuth', 'flash'],
    "confidence-update": ['sessionAuth', 'flash'],
    "settingsupdate" : ['sessionAuth', 'flash'],
    "newuser": ['flash'],
    "block": ["flash","sessionAuth", "admin"],
    "blocklang": ["flash","sessionAuth", "admin"],
    "blocklang-reverse": ["flash","sessionAuth", "admin"],
    "unblock":  ["flash","sessionAuth", "admin"],
    "role":  ["flash","sessionAuth", "admin"],
    "register": ['flash'],
    "signup": ['flash'],
    "list": ['sessionAuth'],
    "confirm-email": ['flash'],
    "confirmed-email":  ['flash', 'sessionAuth'],
    "exportfile": ['sessionAuth'],
    "destroy": ['userCanSeeProfile'],
    "selfdestroy": ["userCanSeeProfile"]
  }

};
