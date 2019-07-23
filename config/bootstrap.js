/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var _ = require('lodash');
var scheduler = require('node-schedule');


module.exports.bootstrap = async function(cb)
{
  //var tasksStatus = TaskService.getTasksStatus();
  var repeatedJob = await scheduler.scheduleJob({minute: 10}, async function(){
      TaskService.getTasksStatus(  function(err, tasks){
        if(err)
          sails.log.error(err)
        else
          sails.log('Scheduled logging:', tasks);
      });
  });

  await Accesslink.destroy({user:"5cf513e1ad676917947457c0"});
  /* 
     "syncing" function serves the case that Crowdsourcing is getting reset
      and possible job-related updates have been lost from the API in the meanwhile
  */
  async function syncingOrgsJobs()
  {
    organisations = await Organisation.find();
    
    _.each(organisations, async function(org) 
    {
      if(org.name != 'Default' && org.api_info.getJobsURL != undefined)
      {
          var orgPostedJobs = await Task.find( {content_owner: org.id });
          //sails.log(orgPostedJobs);
          var orgPostedJobsList = [];
          await _.each(orgPostedJobs, function(postedJob) {
            orgPostedJobsList.push(postedJob.job_id);
          });
          sails.log("Existing from "+org.name, orgPostedJobsList);
          var orgExistingJobs = await TaskService.getJobsFromBroadcaster(org, "all");
          // sails.log(orgExistingJobs);
          var orgExistingJobsList = [];
          await _.each(orgExistingJobs, function(postedJob) {
            orgExistingJobsList.push(postedJob.job_id);
          });
          //sails.log("New from "+org.name,orgExistingJobsList);
      }
    });

    
  }

  async.waterfall([
      info,
      checkOrganisations,
      checkUsers,
  ], function(err, result) {
    sails.log.info(result);
  });

  function info(callback) 
  {
      sails.log.warn('### Database configuration :', sails.config.datastores.default);
      callback(null);
  }

  function checkOrganisations(callback) 
  {
    Organisation.count().exec(function(err, numOrgs) 
    {
      var orgObj = null;
      if (err) {
        sails.log.error(err);
      } 
      else {
        if (numOrgs > 0) 
        {
          sails.log('### Number of organisations :', numOrgs);
          syncingOrgsJobs();
          Organisation.find({}).limit(1).exec(function(err, organisation) 
          {
            if (err) {
              sails.log.error(err);
            } else {
              // pass organisation to checkUsers
              //sails.log(organisation[0])
              return callback(null, organisation[0]);
            }
          });
        } 
        else {
          sails.log('### No organisations found in database');
          orgObj = {
            name: 'Default',
            description: 'Default Organisation',
          };
          Organisation.create(orgObj, function(err, organisation) {
            if (err) {
              sails.log.error(err);
            }
            // pass organisation to checkUsers
            sails.log('### Created organisation', organisation.name);
            return callback(null, organisation);
          });
        }
      }
    });
  }

  function checkUsers(orgObj, callback) 
  {
    User.count().exec(function(err, numUsers) 
    {
      if (err) {
        sails.log.error(err);
        callback(null, 'bootstrap waterfall finished with errors!');
      } 
      else 
      {
        if (numUsers > 0) {
          sails.log('### Number of users :', numUsers);
          callback(null, 'bootstrap waterfall finished');
        } 
        else 
        {
          sails.log('### No users found in database');
          var userObj = {
            lastName: 'Administrator',
            userOrganisation: orgObj.id,
            firstName: 'User',
            email: 'admin@example.com',
            email2: 'admin@example.com',
            password: 'admin@example.com',
            confirmation: 'admin@example.com',
            access: 'admin',
          };
          User.create(userObj, function(err, user) 
          {
            if (err) {
              sails.log.error(err);
            }
            sails.log('### Created user', userObj.email);
            return callback(null, user);
          });
        }
      }
    });
    //callback(null, 'bootstrap waterfall finished');
  }

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
