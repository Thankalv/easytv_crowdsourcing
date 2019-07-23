var _ = require('lodash');

module.exports = {

  success: function(req, message) {
    req.session.messages['success'].push(message);
  },

  warn: function(req, message) {
    try{
      req.session.messages['warning'].push(message);
    }
    catch(error) {
      req.session.messages = { success: [], error: [], warning: [] };
      req.session.messages['warning'].push(message);
    }
  },

  error: function(req, message) {
    req.session.messages['error'].push(message);
  },

  /**
   * [parseValidationError description]
   * @param  {[type]} req [description]
   * @param  {[type]} err [description]
   * @return {[type]}     [description]
   */
  parseValidationError: function(req, err) 
  {
    _.forOwn(err.invalidAttributes, function(value, key) 
    {
      // sails.log.warn('value=', value);
      // sails.log.warn('key=', key);
      _.each(value, function(obj) 
      {
        _.forOwn(obj, function(value2, key2) {
          if (key2 === 'message') {
            FlashService.error(req, value2);
          }
          // sails.log.verbose('key2=', key2);
          // sails.log.debug('value2=', value2);
        });
      });
    });
  },

}
