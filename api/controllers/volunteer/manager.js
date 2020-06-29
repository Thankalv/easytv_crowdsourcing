module.exports = {

    friendlyName: 'Admin manages list of pending users',
    inputs: {
      id: {
        type: 'string',
        description: 'The id of the organisation'
      },
      lang: {
        type: 'string',
        description: 'The code of language to display'
      }
    },
    exits: {
        success: {
          statusCode: 200,
          description: 'show the volunteer-manager page.',
          viewTemplatePath: 'volunteer/manager'
        },
      },

    fn: async function (inputs, exits)
    {
      if(inputs.lang)
        var testlang = inputs.lang;
      else
        var testlang = "es";

      var userOrg = this.req.session.User.userOrganisation.id;
      // Separate the volunteers into 3 categories according to their progress-phase in the selected language
      var allUsers = await User.find({userOrganisation: userOrg}).sort('createdAt ASC' );
      var pendUsers = [], testUsers = [], suitableUsers = [];
      await _.each(allUsers, async function(user) {
        const isPending = VoluntService.isPending( user, testlang);
        const isTesting = VoluntService.isTested( user, testlang);
        const isSuitable = VoluntService.isSuitable( user, testlang);
        if(isPending) pendUsers.push(user);
        if(isTesting) testUsers.push(user);
        if(isSuitable) suitableUsers.push(user);
      });

      await _.each(testUsers , async function(user) {
        var userAssignedJobs = await Accesslink.find( {user: user.id} );
        var uAssJobList = await userAssignedJobs.map( ajob => { return ajob.job_id});
        if(uAssJobList[0]){
          var testJob = await Task.findOne({job_id:uAssJobList[0], content_owner: userOrg, confidence_level:"low", action: "edition"});
          if(testJob)
            user.testJob = testJob;
        }
      });
      //sails.log(testUsersEng);
      return exits.success({ pendUsers:pendUsers, testUsers:testUsers, suitableUsers:suitableUsers, langcode: testlang});
    }
};
