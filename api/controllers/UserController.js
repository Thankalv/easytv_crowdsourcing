/**
 * UserController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// var _ = require('lodash');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var ISO6391 = require('iso-639-1')

module.exports = {
  
  list: function(req, res, next) 
  {
    User.find()
    .exec( function returnUsers(err, users)
    {
      if(users)
         res.json(users);
       else
       {       
            return res.redirect('/');
       }
    });
  },

    /**
   * User index action
   * Renders the complete user list
   */
  index: function(req, res) 
  {
    async.waterfall(
      [
        // Fetch users
        function(callback) {
          if (req.session.User.access == "superadmin")
            UserService.getUsers({}, callback);
          else if (req.session.User.access == "admin")
            UserService.getUsers({userOrganisation: req.session.User.userOrganisation.id}, callback);
          else {
            // UserService.getUsers({email: req.session.User.email}, callback);
            return res.redirect('/user/edit?id='+req.session.User.id)
          }
        },
        // Fetch last logins for users
        function(users, callback) {
          getLastLogin(users, callback);
        }
      ],
      /**
       * Main callback function which is called after all waterfall tasks are processed
       * or an error occurred on those.
       * @param   {null|Error}            error
       * @param   {sails.model.user[]}    users
       */
      function(error, users) {
        if (error) {
          return res.notFound();
        } else {
          res.view({
            users: users
          });
        }
      }
    );

    /**
     * Private function to fetch last LOGIN data for each user.
     * @param   {sails.model.user[]}    users
     * @param   {Function}              next
     */
    function getLastLogin(users, next) 
    {
      async.map(
        users,
         /** Iterator function which is called with every user object in input array.
         * @param   {sails.model.user}  user        User object
         * @param   {Function}          callback    Callback function to call after task is finished
         */
        function(user, callback) 
        {
          // Fetch user last LOGIN record
          user.lastLogged = UtilService.fromNow(user.lastLogged)
          callback(null, user);

        },
        //Callback function which is called after all users have been processed
        function(error, users) {
          next(error, users);
        }
      );
    }
  },

  /**
   * [new-user description]
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
  */  
  newuser: function(req, res)
  {
    FlashService.warn(req, 'You will be able to delete your data at any time');
    res.redirect('/user/register');
  },

  /**
   * [register description]
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  register: function(req, res) 
  {
    Organisation.find()
    .exec(function(err, organisations) 
    {
        if (err) {
          sails.log.error(err);
          return res.notFound();
        }
        if (organisations.length == 0) {
          sails.log.error(err);
          return res.notFound();
        }
       // var default_organisation_id = organisations[0].id;
          var default_organisation_id = 000;
          if (req.param("orgid")) {
            default_organisation_id = req.param("orgid");
          } else {
            _.each(organisations, function(org) {
              if (org.name === 'Default')
                default_organisation_id = org.id;
            });
          }
          res.view( {
            orgid: default_organisation_id,
            organisations: organisations,
            langs: sails.config.custom.langs,
            langsISO: sails.config.custom.langsISO,
            levels: [   { num: 1, description: 'Junior'},
                      { num: 2, description: 'Intermediate'},
                      { num: 3, description: 'Proficiency'}] ,
            allow_mods: false,
            user: null
          });
     });
  },

    /**
   * [signup description]
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   */
  signup: async function(req, res) 
  {
    // Pass a clean userObj to the database
    var userObj = {
      lastName: req.param('lastName'),
      firstName: req.param('firstName'),
      userOrganisation: req.param('userOrganisation'),
      email: req.param('email'),
      email2: req.param('email2'),
      password: req.param('password'),
      confirmation: req.param('confirmation'),
      access: 'editor', // users initialized as 'editors'
      request_mod : req.param('mod'),
      warrant: req.param('warrant'),
      warrant2: req.param('warrant2'),
      personal_code: req.param('personal_code'),
      personal_code2: req.param('personal_code2'),
      age: req.param('age'),
      gender: req.param('gender'),
      ethnicity: req.param('ethnicity'),
      token: req.param('orgtoken'),
      lastLogged: new Date()
      // custom: req.param('custom'),
    };

    if (typeof req.param('lang0') !== 'undefined')
    {
        userObj = await UserService.getLangParameters(req, userObj);
        sails.log(userObj);
    }
    //sails.log(req.allParams());

    // trim name
    var userOrg = null;
    var orgid = req.param('userOrganisation');
    var message = 'Unknown error';
    var hasError = false;
    var show_warrant = false,
      show_personal_code = false,
      show_age = false,
      show_gender = false,
      show_ethnicity = false,
      consent_required = false,
      token_required = false;

      var userOrg = await Organisation.findOne({ id: orgid });

      if (userOrg === null) {
        message = 'Error in Organisation properties.';
        hasError = true;
      } else {
        //sails.log.debug(userOrg);
        show_warrant = userOrg.warrant;
        show_personal_code = userOrg.personal_code;
        show_age = userOrg.age;
        show_gender = userOrg.gender;
        show_ethnicity = userOrg.ethnicity;
        consent_required = userOrg.consent_required;
        token_required = userOrg.token_required;
      }

      //check Org token
      if (token_required)
        if (req.param('orgtoken') !== userOrg.token) {
          message = 'Invalid Security Token. Please provide the security token provided by your Organisation';
          hasError = true;
        }
      if (consent_required)
        if (req.param('agree') !== "agree") {
          message = 'You need to agree with the CONSENT FORM!';
          hasError = true;
        }
      if (req.param('password') !== req.param('confirmation')) {
        message = 'Password and Confirmation Password mismatch.';
        hasError = true;
      }
      if (req.param('email') !== req.param('email2')) {
        message = 'E-mail and Confirmation E-mail mismatch.';
        hasError = true;
      }

      if (hasError) {
        userObj.password = '';
        userObj.confirmation = '';
        sails.log.error(message);
        FlashService.error(req, message);
        return res.redirect('/user/register');
      }
      // remove unwanted values
      delete userObj.confirmation;
      delete userObj.warrant2;
      delete userObj.email2;
      delete userObj.personal_code2;
      delete userObj.token;
      userObj.emailProofToken = await sails.helpers.strings.random('url-friendly');
      userObj.emailProofTokenExpiresAt = Date.now() + sails.config.custom.emailProofTokenTTL;
      userObj.emailStatus = 'unconfirmed';
      userObj.settings= {
        "emailNewJob": "no",
        "emailRejectJob": "yes",
        "showOtherJobs": "yes"
      };
      
      var newUser =  await User.create(userObj)
         .intercept('E_UNIQUE', ()=>{  FlashService.error(req, 'Error creating User'); return res.redirect('/user/register'); })
         .fetch();

      newUser.userOrganisation = await Organisation.findOne({ id: orgid });
      
      if (req.session.authenticated) {
         // check if we must add confirmation mail
      } 
      else {
        req.session.authenticated = true;
        req.session.User = newUser;
       //req.session.userAvatar = newUser.gravatarImage;
     }

     if (sails.config.custom.verifyEmailAddresses) 
     {
      // Send "confirm account" email
      await sails.helpers.sendTemplateEmail.with({
        to: newUser.email,
        subject: 'Please confirm your account',
        template: 'email-verify-account',
        templateData: {
          fullName: User.fullName(newUser),
          token: newUser.emailProofToken
        }
      });
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }

     FlashService.success(req, 'Created User ' + newUser.email);
     return res.redirect('/');

  },

  
  /**
   * [update description]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  update: async function(req, res, next) {
    // protect access param, can add only if user is admin
    sails.log(req.allParams());
    var userObj = {};

    if (req.param('lastName'))
      userObj.lastName = req.param('lastName').trim();

    if (req.param('firstName'))
      userObj.firstName = req.param('firstName').trim();

    if (req.param('userOrganisation'))
      userObj.userOrganisation = req.param('userOrganisation');

    if (req.param('email'))
      userObj.email = req.param('email');

    //TODO: needed ?
    if (req.param('email2'))
      userObj.email2 = req.param('email2');

    if (req.param('password'))
      userObj.password = req.param('password');

    if (req.param('confirmation'))
      userObj.confirmation = req.param('confirmation');

    if (req.param('warrant'))
      userObj.warrant = req.param('warrant');

    if (req.param('personal_code'))
      userObj.personal_code = req.param('personal_code');

    if (req.param('age'))
      userObj.age = req.param('age');

    if (req.param('gender'))
      userObj.gender = req.param('gender');

    if (req.param('ethnicity'))
      userObj.ethnicity = req.param('ethnicity');

    if (req.param('custom'))
      userObj.custom = req.param('custom');

    if (req.param('description'))
      userObj.description = req.param('description').trim();

    //userObj.lastLogged = new Date();

    // TODO: use session variable
    var referer = req.param('referer') || '/';
    // security check for non-admin users
    // only admins can change access role
    if (req.session.User.access === "superadmin") {
      userObj.access = req.param('access');
      userObj.request_mod = "done";
    } else {
      // TODO: check if it works for non-admin users
      if (req.query.access)
        delete req.query.access;
    }
    var user2update = await User.findOne(req.param('id'));
    userObj.lang_info = await UserService.updateLangParameters(user2update, req);

    //delete userObj.confirmation;
    //console.log(req.param('id'));
    var updUser = await User.updateOne(req.param('id'))
      .intercept( ()=>{  
        FlashService.error(req, 'Error updating the user');  
        return res.redirect('/user/edit/' + req.param('id')); })
      .set(userObj);

    if(updUser)
      return res.redirect(referer);
    else{
      FlashService.error(req, 'Cannot update User.');
      return res.redirect('/user/edit/' + req.param('id'));
    }

  },


    /**
   * [exportfile description]
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  exportfile: async function(req, res) 
  {

      users = await User.find().populate("userOrganisation");

      var filename = 'users_export.csv';
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', 'text/plain');
      res.charset = 'UTF-8';
      // write header
      var line = 'lastname, firstname, email, userlevel, organisation, date_created\n';
      // write data
      res.write(line);
      if (!_.isUndefined(users[0])) 
      {
        _.each(users, function(user) {
          var lastname, firstname, email, userlevel, organisation, datecr;
          lastname = user.lastName;
          firstname = user.firstName;
          email = user.email;
          userlevel = user.access;
          organisation = '';
          datecr = moment(user.createdAt).fromNow()
          if (!_.isUndefined(user.userOrganisation) && user.userOrganisation != null){
            organisation = user.userOrganisation.name;
          }
          line = lastname + ',' + firstname + ',' + email + ',' + userlevel + ',' + organisation + ',' + datecr + '\n';
          res.write(line);
        });
      }

      res.end();
    
  },

  /**
   * [destroy description]
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  destroy: async function(req, res, next) 
  {
    var uid = req.param('id');
    await Accesslink.destroy({user:req.param('id')});

    User.findOne(uid, function foundUser(err, user) 
    {
      if (err) {
        FlashService.error(req, err.details);
        return res.redirect('/user');
      }      
      if (!user) return next('User doesn\'t exist.');
      // check if user has judgements
      if (user) {
          sails.log.warn('User <'+user.email+'> is deleted!');
          User.destroy(req.param('id'), function userDestroyed(err) {
            if (err) {
              FlashService.error(req, err);
              return res.redirect('/user');
            }
          });
      }
      res.redirect('/user');
    });
  },

}