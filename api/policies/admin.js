/**
 * Authenticated admin
 */

module.exports = function(req, res, next) 
{
  orgId = req.param('id');
  if (_.isUndefined(orgId)) {
    FlashService.error(req, 'Your request lacks a valid org "id".');
  }
  var isOrgsAdmin = (req.session.User.userOrganisation.id === orgId);

  if (req.session.User && req.session.User.access === "superadmin") {
    return next();
  }

  // Admin of this organisation is allowed, proceed to controller
  if (req.session.User && (req.session.User.access === "admin" && isOrgsAdmin)) {
    return next();
  }
  else  // a no-admin user is NOT allowed
  {
    FlashService.error(req, 'You must be an administrator of this organisation.');

    //TODO: check for req.path functionality
    req.session.returnTo = req.path;
    res.redirect('/');
    return;
  }
};
