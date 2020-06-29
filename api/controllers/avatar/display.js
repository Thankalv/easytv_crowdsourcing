module.exports = {

    friendlyName: '3d Viewer',
  
    description: 'Display the 3Dviewer player for a certain motion file',
    inputs: {
      motion_file:{
        type: 'string',
        description: "the motion file to display"
      }
    },
    exits: {
  
      success: {
        statusCode: 200,
        description: 'show the avatar viewer',
        viewTemplatePath: 'avatar/motion'
      },
    },
  
    fn: async function (inputs, exits) 
    {
        if(inputs.motion_file)
         return exits.success({motionfile:inputs.motion_file});
        else
          return exits.success({ motionfile: "Motion_Emilio-4_new.fbx" });
    }
  
  };
  