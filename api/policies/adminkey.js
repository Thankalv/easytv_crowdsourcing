/**
 * adminKey
 *
 * @module      :: Policy
 * @description :: http-header based auth Policy to allow API requests with valid API-key
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    var headerToken = req.header("Admin-Key")
    //console.log(req.headers);
    //console.log('Remote connection ip:', req.connection.remoteAddress);

    // Client is allowed, proceed to the next policy,
    if (headerToken == sails.config.custom.adminKey)
    {
        return next();
    } 
    else 
    {
      // Client is not allowed
      res.statusCode = 401;
      return res.json({err: "Unauthorized. Invalid 'Admin-Key' API header "});

    }
  };
  
