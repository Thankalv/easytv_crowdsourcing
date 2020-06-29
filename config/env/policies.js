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

  avatar: {  
    "*": [ "flash"] 
  },

  task:{
    '*' : ['sessionAuth', 'superadmin'],
    'assign': ['sessionAuth'],
    'duplicount': ['sessionAuth'],
    "list": ["adminkey"],
    'unassign': ['sessionAuth'],
    'refreshtoken':  ['sessionAuth'],
    'destroy': ["adminkey"],
    'uploadvideo':  ['sessionAuth'],
    'uploadmocap':  ['sessionAuth'],
    'uploadtest':  ['sessionAuth'],
    'uploadsuggestion':  ['sessionAuth'],
    'uploadtranslation':  ['sessionAuth'],
    'uploadmocapextra': ['sessionAuth'],
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
    'reset-subt':  ['xEasyTv'],
    'update-subt':  ['xEasyTv'],
    'confirm-subt': ['xEasyTv'],
    'statsreview-subt': ['xEasyTv'],
    'statseditor-subt': ['xEasyTv'],
    'user-modlevel': ['xEasyTv'],
    'log-error': ['sessionAuth'],
    'update-user': ['adminkey'],
    'update-org': ['adminkey'],
    'motion-concept': ['xEasyTv'],
    'api-version': true
  },

  video_annotation:{
    "*": [ 'flash','sessionAuth']
  },

  organisation:{
    '*' : ['adminkey'],
    "get": ['flash',"sessionAuth",'superadmin'],
    "new": ['flash',"sessionAuth",'superadmin'],
    "create": ['flash',"sessionAuth",'superadmin'],
    "show": ['flash',"sessionAuth",'admin'],
    "refreshtoken": ['sessionAuth',"admin"],
    "update": ['sessionAuth',"admin"],
    "update-email": ['sessionAuth',"admin"],
    "api-info": ['sessionAuth',"admin"]
  },

  volunteer :{
    "*": ['flash',"sessionAuth",'admin'],
    "testing":  ['sessionAuth', 'flash'],
    "evaluation":  ['sessionAuth', 'flash'],
    "register":  [ 'flash'],
    "complete-reg":  [ 'flash']
  },

  userjobstats:{
    "*": ["adminkey"]
  },

  user:{
    "*": ['adminkey'],
    "index" : ['sessionAuth'],
    "newuser": ['flash'],
    "get": ["sessionAuth", "admin"],
    
    "edit" : ['sessionAuth', 'sameOrg', 'flash'],
    "update": ['sessionAuth', 'sameOrg', 'flash'],
    "settings" : ['sessionAuth', 'flash'],

    "confidence-levels": ["sessionAuth", "flash", "admin"],
    "confidence-review": ['sessionAuth', 'flash'],
    "confidence-update": ['sessionAuth', 'flash'],
    "confidence-change": ['sessionAuth', 'flash'],

    "settingsupdate" : ['sessionAuth', 'flash'],
    "block": ["flash", "sessionAuth", "admin"],
    "blocklang": ["flash","sessionAuth", "admin"],
    "blocklang-reverse": ["flash","sessionAuth", "admin"],
    "unblock":  ["flash","sessionAuth", "admin"],
    "role":  ["flash","sessionAuth", "admin"],
    "prim-lang": ["flash", "sessionAuth"],
    "register": ['flash'],
    "signup": ['flash'],
    "list": ['sessionAuth'],
    "task-subscribe": ['sessionAuth'],
    "confirm-email": ['flash'],
    "confirmed-email":  ['flash', 'sessionAuth'],
    "exportfile": ['sessionAuth'],
    "destroy": ['userCanSeeProfile'],
    "selfdestroy": ["userCanSeeProfile"]
  }
};
