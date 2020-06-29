/**
 *  Passport authentication
 *
 * http://sailsjs.org/documentation/concepts/policies/sails-passport
 */

//TODO: check correct file location (MINOR)
var bcrypt = require('bcryptjs'),
  passport = require('passport'),
  BearerStrategy = require('passport-http-bearer').Strategy,
  BasicStrategy = require('passport-http').BasicStrategy,
  LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    id: id
  }, function(err, user) {
    if (!err && user !== undefined) {
      done(null, user);
    } else done(err, null);
  });
});

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */

passport.use(
  new LocalStrategy(
    function(email, password, done)
    {
      process.nextTick(
        function() {
          User.findOne({
            email: email
          }).populate('userOrganisation').exec(function(err, user) {
            if (err) {
              sails.log.error('Error in LocalStrategy', err);
              return;
            }
            if (!user) {
              sails.log.error('Unknown User', email);
              return done(
                null, false, {
                  message: 'Unknown User ' + email
                });
            }
            bcrypt.compare(password, user.encryptedPassword, function(err, res) 
            {
              if (err) {
                sails.log('Error in bcrypt', err);
                return done(err, null);
              } else {
                if (!res) {
                  sails.log.error('Error in bcrypt response', err);
                  return done(null, false, {
                    message: 'Invalid password'
                  });
                } else {
                  return done(null, user);
                }
              }
            });
          })
        });
    }));
