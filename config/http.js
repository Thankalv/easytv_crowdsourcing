/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */
var passport = require('passport');


module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/
  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    order: [
       'cookieParser',
       'session',
       'passportInit',
       'passportSession',
       'mySidebarTags',
       'bodyParser',
       'compress',
       'poweredBy',
       'router',
       'www',
       'favicon',
     ],

    passportInit: passport.initialize(),
    passportSession: passport.session(),

    /****************************************************************************
     * a custom sidebar's active tag parser              *
     ****************************************************************************/
    mySidebarTags: function(req, res, next) {
      // console.log("Requested:", req.method, req.url, req.ip);
      var reqString = req.method+' '+req.url;
      
      if(req.session)
        if (reqString.indexOf("GET /log") !== -1){
          req.session.activeTag = 'log'
        }
        else if(reqString.indexOf("GET /feedback") !== -1){
          req.session.activeTag = 'feedback'
        }
        else if(reqString.indexOf("GET /user/settings") !== -1){
          req.session.activeTag = 'settings'
        }
        else if(reqString.indexOf("GET /user") !== -1){
          req.session.activeTag = 'users'
        }
        else if(reqString.indexOf("GET /organisation") !== -1){
          req.session.activeTag = 'org'
        }
        else{
          req.session.activeTag = 'dashboard'
        }

      return next();
    },

    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },

};
