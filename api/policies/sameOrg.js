/**
 * Allow a logged-in user to see, edit, update and delete their own profile
 * Allow admins to do everything
 */

var _ = require('lodash');

module.exports = async function(req, res, next) {

  if (!req.session.authenticated) {
    req.session.returnTo = req.path;
    res.redirect('/session/new');
    return;
  }

  uid = req.param('id');
  if (_.isUndefined(uid)) {
    uid = req.session.User.id;
  }

  var user2edit = await User.findOne(uid).populate('userOrganisation');
  if(!user2edit){
    FlashService.error(req, 'This user-profile seems to be deleted!');
    res.redirect('/users');
    return;
  }

  var sameOrg = (req.session.User.userOrganisation.id === user2edit.userOrganisation.id);

  if(sameOrg || req.session.User.access === "superadmin"){
    next();
  }
  else{
    FlashService.error(req, 'This user does not collaborates with your organisation!');
    res.redirect('/user');
    return;
  }


};
