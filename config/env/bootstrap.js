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
var fs = require('fs');

module.exports.bootstrap = async function(cb)
{
  // schedule a task inspection routine
  // var repeatedJob = await scheduler.scheduleJob({minute: 10}, async function(){});

  await OntologyService.updateLocalDB();

  var allOrgs = await Organisation.find();
  await _.each(allOrgs, async function(org) 
  {
    if(!org.blocked)
      await Organisation.updateOne({id:org.id}, {blocked:{users:[]}});
  });


  // var testJobs = await Task.find({confidence_level:"low", status : "AwaitingForEdition"})
  if(sails.config.custom.restoreOrgs=='YES')
    await _.each(sails.config.oldorgs.orgs, async function(org){
      await Organisation.create(org);
    });

    if(sails.config.custom.forceConfirmed=='YES')
      await User.update({}).set({emailStatus: "confirmed"})

    var allUsers = await User.find();
    await _.each(allUsers, async function(nuser) {
        if(!nuser.lang_info)
          await User.updateOne({id:nuser.id}, {lang_info:{langs:[]}});
    });


  /**
   * "syncing" function serves the case that Crowdsourcing is getting reset
   *  and possible job-related updates have been lost from the API in the meanwhile
   */
  async function syncingOrgsJobs()
  {
    var organisations = await Organisation.find();
    await _.each(organisations, async function(org) 
    {
      if(org.name != 'Default' && org.name != 'Sign Language User' && org.api_info.getJobsURL != undefined)
      {
          var orgPostedJobs = await Task.find( {content_owner: org.id});
          var orgPostedJobsList = [];
          await _.each(orgPostedJobs, function(postedJob) {
            orgPostedJobsList.push(postedJob.job_id);
          });
          //sails.log("Existing from "+org.name, orgPostedJobsList);
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
          // reset the Super-Admin's password in any case...
           Organisation.findOne({description: { contains: 'Default' }}, 
           function(err, defOrg) 
           {
              if(defOrg)
              {
                  User.updateOne({email:"admin@example.com"}, {userOrganisation:defOrg.id , password: 'admin@example.com', confirmation: 'admin@example.com' },
                  function(err,user){
                    callback(null, 'bootstrap waterfall finished (Admin org was reset!)');
                  });
              }
              else
                callback(null, 'bootstrap waterfall finished');
           });
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
