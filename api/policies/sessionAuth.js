/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = async function(req, res, next) {

    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    if (req.session.authenticated && req.session.User.access) {

      return next();
    } 
    else 
    {
      // User is not allowed
      var requireLoginError = {
        name: "requireLogin",
        message: "You must be signed in."
      };
  
      req.session.returnTo = req.path;
      FlashService.warn(req, 'Please use your credentials to login!')
      res.redirect('/session/new');
      return;
  
      // (default res.forbidden() behavior can be overridden in `config/403.js`)
      //return res.forbidden('You are not permitted to perform this action.');
      //
    }
  };
  