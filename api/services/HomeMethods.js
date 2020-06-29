/**
 * /api/services/OntologyService.js
 *
 * Integration with EasyTv-annotator API (developed by: "oeg-upm.net") related services
 */

var _ = require('lodash');
var reqProm = require('request-promise');
var moment = require("moment");

module.exports = {

    /* 
      prepare the dashboard for the Sign Language Users
    */
    signLangUser: async function(Session)
    {
        var langs = sails.config.custom.ontologyLangs;
        var langsISO = sails.config.custom.ontologyLangsISO;
        var availLangs = [];
        await _.each(langsISO, function(lang) {
        availLangs.push( [langs[langsISO.indexOf(lang)],lang ] );
        });
        if(Session.User.access=="editor"){
        Session.User.usertype = "Worker";
        sails.log(Session.User.usertype);
        }
        else if(Session.User.access=="reviewer"){
        Session.User.usertype = "Evaluator";
        sails.log(Session.User.usertype);
        }
        if(!Session.User.firstLang){  
        Session.User.firstLang = langs[langsISO.indexOf( Session.User.lang_info.langs[0]['lang0'])];
        Session.User.firstLangISO = Session.User.lang_info.langs[0]['lang0'];
        }
        sails.log(Session.User.firstLang);
        //sails.log(Session.User.lang_info);

       return availLangs;
    },

    /* 
      prepare the dashboard for the Editor/Reviewer users working with a broadcaster org
    */
   editorOrReviewrUser: async function(Session, usersOrg, jobsPosted, userTitle)
   {
      // GET an updated list of pending jobs of the collaborative broadcaster
      var apiJobs = await TaskService.getJobsFromBroadcaster(usersOrg, Session.User.access);
      var userStats = await TaskService.getUserStatsAggregate(Session.User);

      // a list of 'active' assignment access-links from the corresponding SPM/broadcaster
      var assignedJobs = await Accesslink.find();
      var userAssignedJobs = await Accesslink.find({user: Session.User.id});
      var progressStats = await UserJobStats.find({action: "edition"}).sort("updatedAt DESC");
      var usersWorked = await progressStats.map( stat => { return stat.task});
      var assignedJobsList = await assignedJobs.map( ajob => { return ajob.job_id});
      var userAssignedJobsList = await userAssignedJobs.map( ajob => { return ajob.job_id});
      Session.User.jobList = assignedJobsList;
  
      var broadcasterJobs = await UtilService.sortByKey(apiJobs[0], "publication_date");
      broadcasterJobs = await UtilService.filterByLang(broadcasterJobs, Session.User);
      // compile a list of this user's assigned (top-list) jobs
      var thisUserJobs = [], pendingBroadcasterJobs = [];
      sails.log(userAssignedJobsList);
      await _.each(broadcasterJobs, async function(ajob)
      {
        if (userAssignedJobsList.indexOf(ajob.job_id)>-1){
          // the accesslink should be omitted in case this users is in the 'block-list'
          ajob.accesslink = userAssignedJobs[userAssignedJobsList.indexOf(ajob.job_id)];
          //if(Session.User.access=="reviewer")
          if (progressStats[usersWorked.indexOf(ajob.job_id)])
            ajob.prevWorker = progressStats[usersWorked.indexOf(ajob.job_id)].worker;
          thisUserJobs.push(ajob);
        }
        else
          if (assignedJobsList.indexOf(ajob.job_id)<0)
            pendingBroadcasterJobs.push(ajob);
      });

      var orgMembers = await User.count({userOrganisation: Session.User.userOrganisation.id});
      var usersOrg = await Organisation.findOne(Session.User.userOrganisation.id);
      if (usersOrg.blocked.users.indexOf(Session.User.id)>-1)
        var isBlocked = true;
      else
        var isBlocked = false;

      //pendingBroadcasterJobs = await pendingBroadcasterJobs.map( ajob => { return await UtilService.cleanTitles(ajob)});

      for(var i = 0; i < pendingBroadcasterJobs.length; i++) {
        pendingBroadcasterJobs[i] = await UtilService.cleanTitles(pendingBroadcasterJobs[i]);
      }
      for(var i = 0; i < thisUserJobs.length; i++) {
        thisUserJobs[i] = await UtilService.cleanTitles(thisUserJobs[i]);
      }
      for(var i = 0; i < apiJobs[1].length; i++) {
        apiJobs[1][i] = await UtilService.cleanTitles(apiJobs[1][i]);
      }

      //sails.log(pendingBroadcasterJobs);

      var retData = {
          isBlocked: isBlocked, userTitle: userTitle, userStats : userStats,
          orgMembers: orgMembers,jobsPosted: jobsPosted, assignedJobs: thisUserJobs,
          subz: pendingBroadcasterJobs, otherSubz: apiJobs[1], langs: sails.config.custom.langs,
          langsISO: sails.config.custom.langsISO,levels: sails.config.custom.workflow_levels
      };
      return retData;
   }

}