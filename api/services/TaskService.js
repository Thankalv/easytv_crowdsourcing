/**
 * /api/services/TaskService.js
 *
 * Task related services
 */

var _ = require('lodash');
var reqProm = require('request-promise');
var moment = require("moment");

module.exports = {

    getTasksStatus: async function(next) {
       var tasks = await Task.find();
       var statuses = [];
       async.each(tasks,
        function(task, callback) {
           //sails.log(task.status);
           statuses.push(task.status);
           callback();
        },
        function(err) {
            next(err, statuses);
        });
    },
    
    getJobsFromBroadcaster: async function(org, jobType) 
    {
      if(!org.api_info)
        return []
      if(org.api_info.getJobsURL=="NOT_EXIST")
        return []
      if(org.api_info.getJobsURL)
      {
        var options = {}
        options.uri= org.api_info.getJobsURL;  // the url "https://spm-api.easytv.eng.it/api" is substituted with "spm_stack_spm_api/api"
        options.headers= {'User-Agent': 'Request-Promise'};
        options.headers[org.api_info.headerName] = org.api_info.headerToken;
        options.json = true;  // Automatically parses the JSON string in the response
      
        // GET an updated list of translation-jobs from the collaborating broadcaster database
        var broadcasterJobs = await reqProm(options).catch(
            function(err) { sails.log.error('Broadcaster GET jobs errorcode: '+ err.statusCode + " with message:" + err.message)
          });
        // jobs for REVIEWERS
        if(jobType=="editor"){
          var editorJobs = [], otherJobs = [];
          await _.each(broadcasterJobs, ajob => {
              if (["OnEdition","AwaitingForEdition", "OnEditionSaved"].indexOf(ajob.status)>-1){
                if(ajob.confidence_level!="low" && org.token==ajob.content_owner.toUpperCase())
                  editorJobs.push(ajob);
                if(ajob.confidence_level!="low" && org.token!=ajob.content_owner.toUpperCase())
                  otherJobs.push(ajob);
              }
            });
            return [editorJobs,otherJobs];
        }
        // jobs for EVALUATORS
        if(jobType=="reviewer"){
          var editorJobs = [], otherJobs=[];
          await _.each(broadcasterJobs, ajob => {
              if (["OnRevision","AwaitingForRevision", "OnRevisionSaved"].indexOf(ajob.status)>-1){
                if(ajob.confidence_level!="low" && org.token==ajob.content_owner.toUpperCase())
                  editorJobs.push(ajob);
                if(ajob.confidence_level!="low" && org.token!=ajob.content_owner.toUpperCase())
                  otherJobs.push(ajob);
              }
            });
            return [editorJobs,otherJobs];
        }
        else
        {
          var assignedJobs= [];
          await _.each(broadcasterJobs, ajob => {
            if (["OnEdition","AwaitingForEdition", "OnEditionSaved"].indexOf(ajob.status)>-1)
              if(ajob.confidence_level!="low" && org.token==ajob.content_owner.toUpperCase())
                assignedJobs.push(ajob); 
          });
          await _.each(broadcasterJobs, ajob => {
            if (["OnRevision","AwaitingForRevision", "OnRevisionSaved"].indexOf(ajob.status)>-1) 
              if(ajob.confidence_level!="low" && org.token==ajob.content_owner.toUpperCase())
                assignedJobs.push(ajob); 
          });
          return assignedJobs;
        }
      }
     },

     /* 
       Asign a pending job to a registered user by sending Crowdsourcing <triplet-access>
     */
    assignUserAJob: async function(org, creds)
    {
        var options = {};
        options.method = 'POST';
        options.uri = org.api_info.postUserJob,
        options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
        options.headers[org.api_info.headerName] = org.api_info.headerToken;
        options.body = creds;
        options.json = true;   // Automatically parses the JSON string in the response

        var newAssignment =  await reqProm(options).catch(
          function(err) { sails.log.error('Broadcaster POST credential/job errorcode: '+ err.statusCode + " with message:" + err.message)
        });

        return newAssignment;
     },

     /* 
       Reset a job in SPM
     */
    resetAJob: async function(org, job_id)
    {
        var options = {};
        options.method = 'PUT';
        options.uri = "https://spm-api.easytv.eng.it/api/Jobs/"+job_id+"/reset",
        options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
        options.headers[org.api_info.headerName] = org.api_info.headerToken;
        options.json = true;   // Automatically parses the JSON string in the response

        var resetResponse =  await reqProm(options).catch(
          function(err) { sails.log.error('Broadcaster PUT /job/id/reset errorcode: '+ err.statusCode + " with message:" + err.message)
        });
        sails.log(resetResponse);
        return resetResponse;
     },


     /* 
       Create a new DB record for statistics after a user-job assignment 
     */
    saveUserStatistics: async function(job, user_id, userRole) 
    {
      if(userRole=="editor")
        userJobStatsObj = {
            'worker':  user_id, 
            'task': job.job_id,
            'status': job.status,
            'action': 'edition',
            "confidence_level": job.confidence_level,
            "asset_duration": job.asset_duration,
            "viewed_percent": job.viewed_percent_editor,
            "edited_percent": job.edited_percent_editor,
            "validated_percent":  job.validated_percent_editor,
            }
      else
        userJobStatsObj = {
            'worker':  user_id, 
            'task': job.job_id,
            'status': job.status,
            'action': 'review',
            "confidence_level": job.confidence_level,
            "asset_duration": job.asset_duration,
            "viewed_percent": job.viewed_percent_reviewer,
            "edited_percent": job.edited_percent_reviewer,
            "validated_percent":  job.validated_percent_reviewer,
          }

        var stats = await UserJobStats.create(userJobStatsObj)
                                .intercept( (err)=>{ sails.log.error(err) })
                                .fetch();
        return stats;
     },

     /* 
     * Update an existing DB record for statistics after a user-job progress 
     */
    updateUserStatistics: async function(job, userRole) 
    {
      if(userRole=="editor")
        userJobStatsObj = {
          'task': job.job_id,
          'status': job.status,
          'action': 'edition',
          "confidence_level": job.confidence_level,
          "asset_duration": job.asset_duration,
          "viewed_percent": job.viewed_percent_editor,
          "edited_percent": job.edited_percent_editor,
          "validated_percent":  job.validated_percent_editor,
        }
      else
        userJobStatsObj = {
          'task': job.job_id,
          'status': job.status,
          'action': 'review',
          "confidence_level": job.confidence_level,
          "asset_duration": job.asset_duration,
          "viewed_percent": job.viewed_percent_reviewer,
          "edited_percent": job.edited_percent_reviewer,
          "validated_percent":  job.validated_percent_reviewer,
        }
        var stats = await UserJobStats.updateOne({task: job.job_id, action: userJobStatsObj.action, status: { '!=' : 'Rejected'}})
                                      .set(userJobStatsObj)
                                      .intercept( (err)=>{ sails.log.error(err) });
        if(userRole=="editor" && job.validated_percent_editor==100.0 && stats){
          await UserService.notifyReviewers(job.job_id, job.content_owner);
        }

        return stats;
     },

     /* 
     * Create a new record about a "piece of progress" on a certain job
     */
    updateProgress: async function(statsPrev, statsNow) 
    {
      delete statsNow.id;
      delete statsNow.createdAt;
      JobProgObj = statsNow;
      JobProgObj["viewed_percent"] = statsNow.viewed_percent - statsPrev.viewed_percent;
      JobProgObj["edited_percent"] = statsNow.edited_percent - statsPrev.edited_percent;
      JobProgObj["validated_percent"] = statsNow.validated_percent - statsPrev.validated_percent;
      var stats = await UserJobProgress.create(JobProgObj).fetch();
      return stats;
    },

    /* 
    * Mark a statistics DB record as 'rejected' and create a new one after a user-job reassignment 
    */
    resetUserStatistics: async function(job_id, user_id) 
    {
      var prevStats = await UserJobStats.findOne({worker:user_id, task: job_id, action: "edition", status: { '!=' : 'Rejected'}} );
      if(prevStats){
        sails.log("Previous job-stats record is marked as rejected!");
        await UserJobStats.update({ worker: user_id, task: job_id, status: { '!=' : 'Rejected'}}).set({status:'Rejected'});

        userJobStatsObj = { 'worker': user_id, 'task': job_id, 'status': prevStats.status, 'action': prevStats.action }
        await UserJobProgress.destroy({task:job_id, worker:user_id});

        var stats = await UserJobStats.create(userJobStatsObj).intercept( (err)=>{ sails.log.error(err) }).fetch();
        return stats;
      }
    },

    /* 
    * Find and Aggregate user-statistics of active or pending jobs 
    */
    getUserStatsAggregate: async function(user)
    {
      var userRole = '';
      if (user.access=='editor')
        userRole = 'edition';
      else
        userRole = 'review';

      var stats = await UserJobStats.find({worker:user.id, status: { '!=' : 'Rejected'}});
      var totalViewTime = 0.0;
      var totalEditTime = 0.0;
      await _.each(stats, stat => {
        // sails.log(stat.data.asset_duration);
        totalEditTime = totalEditTime +  moment.duration( stat.asset_duration).asSeconds() * (stat.edited_percent/100.0)
        totalViewTime = totalViewTime +  moment.duration( stat.asset_duration).asSeconds() * (stat.viewed_percent/100.0)
      });

      //sails.log(totalEditTime);
      var userSummary = {};
      userSummary['projects'] = stats.length;
      userSummary['editTime'] = UtilService.secs2HHMMSS( totalEditTime );
      userSummary['viewTime'] = UtilService.secs2HHMMSS( totalViewTime );
      userSummary['rejected'] = await UserJobStats.count({worker:user.id, status: 'Rejected'});
      
      return userSummary;
    },

    /*
     * For each assigned-job append the latest progress stats
     */
    getJobsProgress: async function(testJobs) 
    {
      for (var i=0; i<testJobs.length; i++){
        var progressStats = await UserJobProgress.find({task:testJobs[i].job_id})
                              .populate("worker").limit(4)
                              .sort("createdAt DESC");
        //sails.log(progressStats);
        testJobs[i].progress = progressStats;
        //sails.log(testJobs[i].progress);
      }
    },
    /*
     * For each assigned-job append the latest progress stats
     */
    getJobsProgressReviewer: async function(testJobs) 
    {
      for (var i=0; i<testJobs.length; i++){
        var progressStats = await UserJobProgress.find({task:testJobs[i].job_id, action:"edition"})
                              .populate("worker").limit(4)
                              .sort("createdAt DESC");
        //sails.log(progressStats);
        testJobs[i].progress = progressStats;
        //sails.log(testJobs[i].progress);
      }
    },


     /* 
     * Retrieve 'evaluation-level' content from the Broadcaster's API
     * the so-called Tests for the newly registered members
     */
     getTestsFromBroadcaster: async function(org, jobType, lang) 
     {
       if(org.api_info.getJobsURL)
       {
          var options = {}
          options.uri= org.api_info.getJobsURL;  // in Docker-network url should be "spm_stack_spm_api/api"
          options.headers= {'User-Agent': 'Request-Promise'};
          options.headers[org.api_info.headerName] = org.api_info.headerToken;
          options.json = true;  // Automatically parses the JSON string in the response
       
          // GET an updated list of translation-jobs from the collaborating broadcaster database
          var broadcasterJobs = await reqProm(options).catch(
             function(err) { sails.log.error('Broadcaster GET jobs errorcode: '+ err.statusCode + " with message:" + err.message)
          });
         // get content for REVIEWERS
          if(jobType=="editor"){
              var testingJobs = [];
              await _.each(broadcasterJobs, ajob => {
                if (["OnEdition","AwaitingForEdition", "OnEditionSaved"].indexOf(ajob.status)>-1)
                  if(ajob.confidence_level=="low" && ajob.language_target==lang && org.token==ajob.content_owner.toUpperCase())
                    testingJobs.push(ajob);
              });
              return testingJobs;
          }
          if(jobType=="reviewer"){
            var onTestJobs = [], onReviewJobs = [];
            await _.each(broadcasterJobs, ajob => {
              if (["OnEdition","AwaitingForEdition", "OnEditionSaved"].indexOf(ajob.status)>-1)
                if(ajob.confidence_level=="low" && org.token==ajob.content_owner.toUpperCase())
                  onTestJobs.push(ajob);
              if (["OnRevision","AwaitingForRevision", "OnRevisionSaved"].indexOf(ajob.status)>-1)
                if(ajob.confidence_level=="low" && org.token==ajob.content_owner.toUpperCase())
                  onReviewJobs.push(ajob);
            });
            return {"testJobs":onTestJobs, "reviewJobs":onReviewJobs };
          }
       }
     },
}
