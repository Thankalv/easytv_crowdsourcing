
var passport = require('passport');
var bcrypt = require('bcryptjs');
var _ = require('lodash');

module.exports = {
    /**
     * Overrides for the settings in `config/blueprints.js`
     * (specific to SessionController)
     */
    new: function(req, res) 
    {
      if(req.session.authenticated)
          return res.redirect('/');

      if (req.param('login')=="first")
        res.view({homepage:false, welcome:true});
      else
        res.view({homepage:false, welcome:false});
    },
  
    create: async function(req, res, next) 
    {
      //sails.log(req.allParams());
      // Firstly check if the email is confirmed
      var tmpUser = await User.findOne({email:req.param("username")});
      if(tmpUser){
        sails.log.debug(tmpUser.emailStatus);
        if(tmpUser.emailStatus!="confirmed"){
          FlashService.error(req, "Email is not confirmed! Please check your inbox");
          return res.redirect('/session/new');
        }
      }

        // Check for email and password in params sent via the form, if none redirect the browser back to the sign-in form.
        var userObj = {};
        userObj.lastLogged = new Date();
        passport.authenticate('local', function(err, user, info) 
        {
          if ((err) || (!user)) {
            FlashService.error(req, info.message);
            return res.redirect('/session/new');
          }
          // use passport to log in the user using a local method
          req.logIn(user, function(err) 
          {
            if (err) {
              var usernamePasswordMismatchError = [{
                name: 'usernamePasswordMismatch',
                message: 'Invalid username and password combination.'
              }];
              FlashService.error(req, 'Invalid username and password combination.');
              return res.redirect('/session/new');
            } 
            else 
            {
              //LoggerService.Log(user, 'LOGIN', 'Created session for user', req);
              sails.log.debug("Just logged user: ",user.email, " from ", user.userOrganisation.name);

              //sails.log.debug(user.userLanguage);
              userObj.email = user.email;
              userObj.lang_info = user.lang_info;
              User.update( user.id, userObj, function some(err){});
    
              req.session.authenticated = true;
              req.session.User = user;
              req.session.userAvatar = user.gravatarImage;
              req.session.activeTag = 'log';
              // tKalv: language setting according to user's, this overrides the localize.js default to English lang
              //req.session.languagePreference = langs[user.userLanguage];
    
              FlashService.success(req, 'Welcome back ' + req.session.User.lastName + '!'); 
              res.redirect('/');
            }
          });
        })(req, res);
    },

    //TODO: disable in production
    display: function(req, res) {
      FlashService.error(req, 'json error...');
      FlashService.warn(req, 'json warn...');
      res.json(req.session);
    },

    destroy: function(req, res, next) 
    {
      if (req.session.authenticated) {
        User.findOne(req.session.User.id, function foundUser(err, user) 
        {
          if (err) {
            FlashService.error(req, 'User not found.');
            res.redirect('/session/new');
          }
          sails.log("Goodbye to user: ", req.session.User.email);
          // Wipe out the session (log out)
          req.session.destroy();
          // LoggerService.Log(user, 'LOGOUT', 'Destroyed session for user', req);
          // Redirect the browser to the sign-in screen
          res.redirect('/');
        });
      }
      else {
        //error caused by server restart (session already terminated)...
        sails.log("SESSION ALREADY TERMINATED, NO SESSION/DESTROY!")
        res.redirect('/');
      }
    },


  }