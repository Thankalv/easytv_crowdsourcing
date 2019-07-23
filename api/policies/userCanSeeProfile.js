/**
 * Allow a logged-in user to see, edit, update and delete their own profile
 * Allow admins to do everything
 */

var _ = require('lodash');

module.exports = function(req, res, next) {

  if (!req.session.authenticated) {
    req.session.returnTo = req.path;
    res.redirect('/session/new');
    return;
  }

  uid = req.param('id');
  if (_.isUndefined(uid)) {
    uid = req.session.User.id;
  }

  var sessionUserMatchesId = req.session.User.id === uid;
  var isAdmin = req.session.User.access === "superadmin";
  var isReviewer = req.session.User.access === "producer";

  // The requested id does not match the user's id,
  // and this is not an admin
  if (!(sessionUserMatchesId || isAdmin || isProducer)) {
    var noRightsError = [{
      name: 'noRights',
      message: 'You must be an administrator.'
    }];

    FlashService.error(req, 'You must be an administrator.');

    req.session.returnTo = req.path;
    res.redirect('/');
    return;
  }
  next();

};
