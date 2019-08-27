
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
  },

  fn: async function () 
  {
    // check that a user is actually logged-in
    if(this.req.session.User)
    {
      var userTitle =  _.capitalize( sails.config.custom.broadcasterRoles[this.req.session.User.access.toLowerCase()] );
      var usersOrg = this.req.session.User.userOrganisation;
      var jobsPosted = await Task.count( {content_owner: this.req.session.User.userOrganisation.id });
      var isBlocked = false;

      // -- Prepare the dashboard view's data for "Editor"/"Reviewer" roles
      if(this.req.session.User.access!="admin" && this.req.session.User.access!="superadmin")
      {
          // GET an updated list of pending jobs of the collaborative broadcaster
          var broadcasterJobs = await TaskService.getJobsFromBroadcaster(usersOrg, this.req.session.User.access);
          var userStats = await TaskService.getUserStatsAggregate(this.req.session.User);

          // a list of 'active' assignment access-links from the corresponding SPM/broadcaster
          var assignedJobs = await Accesslink.find();
          var userAssignedJobs = await Accesslink.find({user: this.req.session.User.id});
          var assignedJobsList = await assignedJobs.map( ajob => { return ajob.job_id});
          var userAssignedJobsList = await userAssignedJobs.map( ajob => { return ajob.job_id});
          this.req.session.User.jobList = assignedJobsList;
      
          broadcasterJobs = await UtilService.sortByKey(broadcasterJobs, "publication_date");
          broadcasterJobs = await UtilService.filterByLang(broadcasterJobs, this.req.session.User);
          // compile a list of this user's assigned (top-list) jobs
          var thisUserJobs = [], pendingBroadcasterJobs = [];
          await _.each(broadcasterJobs, ajob => {
              if (userAssignedJobsList.indexOf(ajob.job_id)>-1){
                // the accesslink should be omitted in case this users is in the 'block-list'
                ajob.accesslink = userAssignedJobs[userAssignedJobsList.indexOf(ajob.job_id)];
                thisUserJobs.push(ajob);
              }
              else
                if (assignedJobsList.indexOf(ajob.job_id)<0) 
                  pendingBroadcasterJobs.push(ajob);
            });

          var otherSubttitles = await Task.find( {content_owner: { '!=' : this.req.session.User.userOrganisation.id }});
          var orgMembers = await User.count({userOrganisation: this.req.session.User.userOrganisation.id});
          var usersOrg = await Organisation.findOne(this.req.session.User.userOrganisation.id);
          if (usersOrg.blocked.users.indexOf(this.req.session.User.id)>-1)
            isBlocked = true;

          //sails.log(thisUserJobs);
          return {
            isBlocked: isBlocked,
            userTitle: userTitle, 
            userStats : userStats,
            orgMembers: orgMembers, 
            jobsPosted: jobsPosted,
            assignedJobs: thisUserJobs,
            subz: pendingBroadcasterJobs,
            otherSubz: otherSubttitles
          };
      }
      else // Prepare the dashboard view's data for broadcaster "Administrator" role
      {
          if(this.req.session.User.access=="superadmin")
            var orgMembers = await User.find( {access: { '!=': 'superadmin' }} ).populate("accesslinks");
          else
            var orgMembers = await User.find({userOrganisation: this.req.session.User.userOrganisation.id, access: { '!=': 'superadmin' }}).populate("accesslinks");

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
          var assignedJobs = await Accesslink.find();
          var assignedJobsList = await assignedJobs.map( ajob => { return ajob.job_id});
          broadcasterJobs = await UtilService.sortByKey(broadcasterJobs, "publication_date");
          // compile a list of this user's assigned (top-list) jobs
          var assignedBroadcasterJobs = [];
          await _.each(broadcasterJobs, ajob => {
              if (assignedJobsList.indexOf(ajob.job_id)>-1){
                ajob.user = assignedJobs[assignedJobsList.indexOf(ajob.job_id)].user;
                assignedBroadcasterJobs.push(ajob);
              }
            });

          return {
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
            levels: [ { num: 1, description: 'Junior'},
                      { num: 2, description: 'Intermediate'},
                      { num: 3, description: 'Proficiency'},
                      { num: 4, description: 'Blocked'}]
          };
      }
    }
    var orgMembers = await User.count();
    var jobsPosted = await Task.count();
    // render view for a "guest" (not logged-in)
    return { isBlocked: false, userTitle: "Guest",  orgMembers:orgMembers, assignedJobs: thisUserJobs, jobsPosted:jobsPosted, subz:broadcasterJobs, otherSubz: otherSubttitles};
  }

};
