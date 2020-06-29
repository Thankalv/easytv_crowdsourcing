/**
 * LogController
 *
 * Logging for audit
 */

module.exports = {

    index: async function(req, res, next) 
    {
      await User.updateOne(req.session.User.id).set({unreadLogs:false});
      req.session.User.unreadLogs = false;
      if(req.session.User.access!="admin")
        Log.find({user:req.session.User.id})
          .populate('user')
          .sort('createdAt DESC')
          .exec(function(err, logs) {
            if (err) return next(err);
            res.view({
              logs: logs,
            });
          });
        else{
          var logs = await Log.find().populate('user').sort('createdAt DESC');
          return res.view({logs: logs});
        }
    }

}