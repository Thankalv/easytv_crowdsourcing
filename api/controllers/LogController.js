/**
 * LogController
 *
 * Logging for audit
 */

module.exports = {

    index: function(req, res, next) 
    {
      Log.find()
        .populate('user')
        .sort('createdAt DESC')
        .exec(function(err, logs) {
                 
          if (err) return next(err);
          res.view({
            logs: logs,
          });
        });
    },
}