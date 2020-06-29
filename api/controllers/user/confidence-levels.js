module.exports = {

  friendlyName: 'GET users registered',
  description: "SuperAdmin API",
  inputs: {
    id:{
      description: 'The id of the admin organisation',
      type:"string"
    }
  },
  exits: {
      success: {
        statusCode: 200,
        description: 'a view that allows direct management language-level of users',
        viewTemplatePath: 'user/confidence-levels'
      }
    },

  fn: async function (inputs, exits) 
  {
    if(this.req.session.User.access=="superadmin")
      users = await User.find();
    else
      users = await User.find({userOrganisation:inputs.id, access: { '!=': ['superadmin', 'admin'] }});

    return exits.success({users: users,                    
            langs: sails.config.custom.langs,
            langsISO: sails.config.custom.langsISO,
            levels:  sails.config.custom.workflow_levels});
  }
}
