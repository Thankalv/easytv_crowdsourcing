/**
 * Reserved to super-admin
 */

module.exports = function(req, res, next) 
{
  // User is allowed, proceed to controller
  if (req.session.User && req.session.User.access === "superadmin") {
    return next();
  }
  // not admin user is not allowed
  else 
  {
    FlashService.error(req, 'You must be platform΄s super-administrator.');
    //TODO: check for req.path functionality
    req.session.returnTo = req.path;
    res.redirect('/');
    return;
  }
};
