
var reqProm = require('request-promise');

module.exports = {

  friendlyName: 'Homepage',

  description: 'Homepage something.',

  exits: {
    success: {
      statusCode: 200,
      description: 'show the public page.',
      viewTemplatePath: 'homepage'
    },
    signLang: {
      statusCode: 200,
      description: 'show the Sign-Language tasks page.',
      viewTemplatePath: 'video-annotation/gate'
    },
    validationPending: {
      statusCode: 200,
      description: 'show the validation-pending page.',
      viewTemplatePath: 'volunteer/valid-pending'
    },
  },

  fn: async function (inputs, exits) 
  {
    // check that a user is actually logged-in
    if(this.req.session.User)
    {
      var updatedUser = await User.findOne(this.req.session.User.id);
      if(!updatedUser)
        return this.res.redirect("/session/destroy");
      this.req.session.User.lang_info = updatedUser.lang_info;
      this.req.session.User.unreadLogs = updatedUser.unreadLogs;
      var isAdmin = (this.req.session.User.access=="admin" || this.req.session.User.access=="superadmin")
      var userTitle =  _.capitalize( sails.config.custom.broadcasterRoles[this.req.session.User.access.toLowerCase()] );
      var usersOrg = this.req.session.User.userOrganisation;
      var jobsPosted = await Task.count( {content_owner: this.req.session.User.userOrganisation.id });
      var isBlocked = false;

      if(!isAdmin){
        var pending = await VoluntService.onlyPending(this.req.session.User, usersOrg.preReqLang);
        if(pending==true && usersOrg.name!="Sign Language User")
          return exits.validationPending({
              defaultLang: usersOrg.preReqLang,
              langs: sails.config.custom.langs,
              langsISO: sails.config.custom.langsISO,
              levels: sails.config.custom.workflow_levels
            });
      }

      // -- Prepare the dashboard view's template data for a "Sing Language Worker"
      if(usersOrg.name=="Sign Language User")
      {
          var availLangs = await HomeMethods.signLangUser(this.req.session);
          return exits.signLang({availableLangs:availLangs});
      }
      // -- Prepare the dashboard view's data for "Editor"/"Reviewer" roles
      else if(this.req.session.User.access!="admin" && this.req.session.User.access!="superadmin")
      {
          var dashboardData = await HomeMethods.editorOrReviewrUser(this.req.session, usersOrg, jobsPosted, userTitle, isBlocked);

          //sails.log(thisUserJobs);
          return exits.success(dashboardData);
      }
      else // Prepare the dashboard view's data for broadcaster "Administrator" role
      {
          if(this.req.session.User.access=="superadmin")
            var orgMembers = await User.find( {access: { '!=': ['superadmin', 'admin'] }} ).populate("accesslinks", {sort: 'createdAt DESC'} ).populate("userOrganisation");
          else
            var orgMembers = await User.find({userOrganisation: this.req.session.User.userOrganisation.id, access: { '!=': ['admin','superadmin'] }}).populate("accesslinks",  {sort: 'createdAt DESC'});

          var adminsOrg = await Organisation.findOne(this.req.session.User.userOrganisation.id);
          this.req.session.User.userOrganisation = adminsOrg;

          // separate users into editors/reviewers/blocked before rendering the view
          var editorUsers = [], reviewerUsers = [], blockedUsers = [];
          await _.each(orgMembers, function(member) 
          {
            if (adminsOrg.blocked.users.indexOf(member.id)>-1) 
              blockedUsers.push(member);
            else if (member.access == "editor")
              editorUsers.push(member);
            else
              reviewerUsers.push(member)
          });

          // GET an updated list of pending jobs of the collaborative broadcaster
          var broadcasterJobs = await TaskService.getJobsFromBroadcaster(usersOrg, this.req.session.User.access);
          // a list of 'active' assignment access-links from the corresponding SPM/broadcaster
          var assignedJobs = await Accesslink.find().populate("user");
          var assignedJobsList = await assignedJobs.map( ajob => { return ajob.job_id});
          var assignedJobStats = [];
          await _.each(assignedJobs, async function(ajob) { 
            if(ajob.user){
              const stats =  await UserJobStats.findOne({worker:ajob.user.id, task:ajob.job_id, status: { '!=' : 'Rejected'}});
              assignedJobStats.push(stats);
            }
          });
          broadcasterJobs = await UtilService.sortByKeyUp(broadcasterJobs , "job_id");
          broadcasterJobs = await broadcasterJobs.map( ajob => { return UtilService.cleanTitles(ajob)});
          
          // compile a list of this broadcaster's assigned (top-list) jobs
          var assignedBroadcasterJobs = [];
          await _.each(broadcasterJobs, async function(ajob) {
            if (assignedJobsList.indexOf(ajob.job_id)>-1){
              //sails.log(ajob.job_id);
              ajob.worker = assignedJobs[assignedJobsList.indexOf(ajob.job_id)].user.id;
              ajob.stats = assignedJobStats[assignedJobsList.indexOf(ajob.job_id)];
              assignedBroadcasterJobs.push(ajob);
            }
          });
          await TaskService.getJobsProgress(assignedBroadcasterJobs);
          for(var i = 0; i < assignedBroadcasterJobs.length; i++) {
            assignedBroadcasterJobs[i] = await UtilService.cleanTitles(assignedBroadcasterJobs[i]);
          }

          //if(assignedBroadcasterJobs[0])
          //  sails.log(assignedBroadcasterJobs[0].progress);
          
          return exits.success({
              isBlocked: false,
              userTitle: userTitle, 
              orgMembers: orgMembers.length, 
              editorUsers: editorUsers,  
              jobsPosted: jobsPosted,
              assignedJobs: assignedBroadcasterJobs,
              blockedUsers: blockedUsers,
              reviewerUsers: reviewerUsers,
              langs: sails.config.custom.langs,
              langsISO: sails.config.custom.langsISO,
              levels: sails.config.custom.workflow_levels
           });
      }
    }
    else{
      var orgMembers = await User.count();
      var jobsPosted = await Task.count();
      // render view for a "guest" (not logged-in)
      return exits.success({ isBlocked:"false",
                            userTitle: "Welcome",  
                            orgMembers:orgMembers, 
                            jobsPosted:jobsPosted, 
                            subz:broadcasterJobs });  
      }
  }

};
