/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */

var passport = require('passport');

module.exports = {


  /**************************************************************************
  *                                                                         *
  * Tell Sails what database(s) it should use in production.                *
  *                                                                         *
  * (https://sailsjs.com/config/datastores)                                 *
  *                                                                         *
  **************************************************************************/
  datastores: {

    /***************************************************************************
    *                                                                          *
    * Configure your default production database.                              *
    *                                                                          *
    * 1. Choose an adapter:                                                    *
    *    https://sailsjs.com/plugins/databases                                 *
    *                                                                          *
    * 2. Install it as a dependency of your Sails app.                         *
    *    (For example:  npm install sails-mysql --save)                        *
    *                                                                          *
    * 3. Then set it here (`adapter`), along with a connection URL (`url`)     *
    *    and any other, adapter-specific customizations.                       *
    *    (See https://sailsjs.com/config/datastores for help.)                 *
    *                                                                          *
    ***************************************************************************/
    default: {
      // adapter: 'sails-mysql',
      // url: 'mysql://user:password@host:port/database',
      //--------------------------------------------------------------------------
      //  /\   To avoid checking it in to version control, you might opt to set
      //  ||   sensitive credentials like `url` using an environment variable.
      //
      //  For example:
      //  ```
      //  sails_datastores__default__url=mysql://admin:myc00lpAssw2D@db.example.com:3306/my_prod_db
      //  ```
      //--------------------------------------------------------------------------

      /****************************************************************************
      *                                                                           *
      * More adapter-specific options                                             *
      *                                                                           *
      * > For example, for some hosted PostgreSQL providers (like Heroku), the    *
      * > extra `ssl: true` option is mandatory and must be provided.             *
      *                                                                           *
      * More info:                                                                *
      * https://sailsjs.com/config/datastores                                     *
      *                                                                           *
      ****************************************************************************/
      // ssl: true,

    },

  },



  models :{


    /***************************************************************************
    *                                                                          *
    * Whether model methods like `.create()` and `.update()` should ignore     *
    * (and refuse to persist) unrecognized data-- i.e. properties other than   *
    * those explicitly defined by attributes in the model definition.          *
    *                                                                          *
    * To ease future maintenance of your code base, it is usually a good idea  *
    * to set this to `true`.                                                   *
    *                                                                          *
    * > Note that `schema: false` is not supported by every database.          *
    * > For example, if you are using a SQL database, then relevant models     *
    * > are always effectively `schema: true`.  And if no `schema` setting is  *
    * > provided whatsoever, the behavior is left up to the database adapter.  *
    * >                                                                        *
    * > For more info, see:                                                    *
    * > https://sailsjs.com/docs/concepts/orm/model-settings#?schema           *
    *                                                                          *
    ***************************************************************************/
  
    // schema: true,
  
  
    /***************************************************************************
    *                                                                          *
    * How and whether Sails will attempt to automatically rebuild the          *
    * tables/collections/etc. in your schema.                                  *
    *                                                                          *
    * > Note that, when running in a production environment, this will be      *
    * > automatically set to `migrate: 'safe'`, no matter what you configure   *
    * > here.  This is a failsafe to prevent Sails from accidentally running   *
    * > auto-migrations on your production database.                           *
    * >                                                                        *
    * > For more info, see:                                                    *
    * > https://sailsjs.com/docs/concepts/orm/model-settings#?migrate          *
    *                                                                          *
    ***************************************************************************/
  
    migrate: 'safe',
  
  
    /***************************************************************************
    *                                                                          *
    * Base attributes that are included in all of your models by default.      *
    * By convention, this is your primary key attribute (`id`), as well as two *
    * other timestamp attributes for tracking when records were last created   *
    * or updated.                                                              *
    *                                                                          *
    * > For more info, see:                                                    *
    * > https://sailsjs.com/docs/concepts/orm/model-settings#?attributes       *
    *                                                                          *
    ***************************************************************************/
  
    attributes: {
      createdAt: { type: 'number', autoCreatedAt: true, },
      updatedAt: { type: 'number', autoUpdatedAt: true, },
      id: { type: 'number', autoIncrement: true, },
      //--------------------------------------------------------------------------
      //  /\   Using MongoDB?
      //  ||   Replace `id` above with this instead:
      //
      // ```
      // id: { type: 'string', columnName: '_id' },
      // ```
      //
      // Plus, don't forget to configure MongoDB as your default datastore:
      // https://sailsjs.com/docs/tutorials/using-mongo-db
      //--------------------------------------------------------------------------
    },
  
  
    /******************************************************************************
    *                                                                             *
    * The set of DEKs (data encryption keys) for at-rest encryption.              *
    * i.e. when encrypting/decrypting data for attributes with `encrypt: true`.   *
    *                                                                             *
    * > The `default` DEK is used for all new encryptions, but multiple DEKs      *
    * > can be configured to allow for key rotation.  In production, be sure to   *
    * > manage these keys like you would any other sensitive credential.          *
    *                                                                             *
    * > For more info, see:                                                       *
    * > https://sailsjs.com/docs/concepts/orm/model-settings#?dataEncryptionKeys  *
    *                                                                             *
    ******************************************************************************/
  
    dataEncryptionKeys: {
      default: 'ghBbi9hAHMBp/pNSq9UGFVgX/zeBfEGNJJ8tUfJhSSg='
    },
  
  
    /***************************************************************************
    *                                                                          *
    * Whether or not implicit records for associations should be cleaned up    *
    * automatically using the built-in polyfill.  This is especially useful    *
    * during development with sails-disk.                                      *
    *                                                                          *
    * Depending on which databases you're using, you may want to disable this  *
    * polyfill in your production environment.                                 *
    *                                                                          *
    * (For production configuration, see `config/env/production.js`.)          *
    *                                                                          *
    ***************************************************************************/
  
    cascadeOnDestroy: true
  
  
  },



  /**************************************************************************
  *                                                                         *
  * Always disable "shortcut" blueprint routes.                             *
  *                                                                         *
  * > You'll also want to disable any other blueprint routes if you are not *
  * > actually using them (e.g. "actions" and "rest") -- but you can do     *
  * > that in `config/blueprints.js`, since you'll want to disable them in  *
  * > all environments (not just in production.)                            *
  *                                                                         *
  ***************************************************************************/
  blueprints: {

  },



  /***************************************************************************
  *                                                                          *
  * Configure your security settings for production.                         *
  *                                                                          *
  * IMPORTANT:                                                               *
  * If web browsers will be communicating with your app, be sure that        *
  * you have CSRF protection enabled.  To do that, set `csrf: true` over     *
  * in the `config/security.js` file (not here), so that CSRF app can be     *
  * tested with CSRF protection turned on in development mode too.           *
  *                                                                          *
  ***************************************************************************/
  security: {

    /***************************************************************************
    *                                                                          *
    * If this app has CORS enabled (see `config/security.js`) with the         *
    * `allowCredentials` setting enabled, then you should uncomment the        *
    * `allowOrigins` whitelist below.  This sets which "origins" are allowed   *
    * to send cross-domain (CORS) requests to your Sails app.                  *
    *                                                                          *
    * > Replace "https://example.com" with the URL of your production server.  *
    * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
    *                                                                          *
    ***************************************************************************/
    cors: {
      allRoutes: true,
      allowOrigins: ['https://spm.easytv.eng.it'],
      allowRequestMethods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
      allowRequestHeaders: 'content-type, x-easytv-key'
    }

  },



  /***************************************************************************
  *                                                                          *
  * Configure how your app handles sessions in production.                   *
  *                                                                          *
  * (https://sailsjs.com/config/session)                                     *
  *                                                                          *
  * > If you have disabled the "session" hook, then you can safely remove    *
  * > this section from your `config/env/production.js` file.                *
  *                                                                          *
  ***************************************************************************/
  session: {

    /***************************************************************************
    *                                                                          *
    * Production session store configuration.                                  *
    *                                                                          *
    * Uncomment the following lines to finish setting up a package called      *
    * "@sailshq/connect-redis" that will use Redis to handle session data.     *
    * This makes your app more scalable by allowing you to share sessions      *
    * across a cluster of multiple Sails/Node.js servers and/or processes.     *
    * (See http://bit.ly/redis-session-config for more info.)                  *
    *                                                                          *
    * > While @sailshq/connect-redis is a popular choice for Sails apps, many  *
    * > other compatible packages (like "connect-mongo") are available on NPM. *
    * > (For a full list, see https://sailsjs.com/plugins/sessions)            *
    *                                                                          *
    ***************************************************************************/
    host: '127.0.0.1',
    adapter: 'redis',
    url: process.env.CP_REDIS_HOST || "redis://127.0.0.1:6379",
    
    secret: '4521eb9c88ca3909316c6e254e29c7b1',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_session__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //
    //--------------------------------------------------------------------------

    /***************************************************************************
    *                                                                          *
    * Production configuration for the session ID cookie.                      *
    *                                                                          *
    * Tell browsers (or other user agents) to ensure that session ID cookies   *
    * are always transmitted via HTTPS, and that they expire 24 hours after    *
    * they are set.                                                            *
    *                                                                          *
    * Note that with `secure: true` set, session cookies will _not_ be         *
    * transmitted over unsecured (HTTP) connections. Also, for apps behind     *
    * proxies (like Heroku), the `trustProxy` setting under `http` must be     *
    * configured in order for `secure: true` to work.                          *
    *                                                                          *
    * > While you might want to increase or decrease the `maxAge` or provide   *
    * > other options, you should always set `secure: true` in production      *
    * > if the app is being served over HTTPS.                                 *
    *                                                                          *
    * Read more:                                                               *
    * https://sailsjs.com/config/session#?the-session-id-cookie                *
    *                                                                          *
    ***************************************************************************/
    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    },

  },



  /**************************************************************************
  *                                                                          *
  * Set up Socket.io for your production environment.                        *
  *                                                                          *
  * (https://sailsjs.com/config/sockets)                                     *
  *                                                                          *
  * > If you have disabled the "sockets" hook, then you can safely remove    *
  * > this section from your `config/env/production.js` file.                *
  *                                                                          *
  ***************************************************************************/
  sockets: {

    /***************************************************************************
    *                                                                          *
    * Uncomment the `onlyAllowOrigins` whitelist below to configure which      *
    * "origins" are allowed to open socket connections to your Sails app.      *
    *                                                                          *
    * > Replace "https://example.com" etc. with the URL(s) of your app.        *
    * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
    *                                                                          *
    ***************************************************************************/
    onlyAllowOrigins: [
      'https://easytvproject.eu',
    ],


    /***************************************************************************
    *                                                                          *
    * If you are deploying a cluster of multiple servers and/or processes,     *
    * then uncomment the following lines.  This tells Socket.io about a Redis  *
    * server it can use to help it deliver broadcasted socket messages.        *
    *                                                                          *
    * > Be sure a compatible version of @sailshq/socket.io-redis is installed! *
    * > (See https://sailsjs.com/config/sockets for the latest version info)   *
    *                                                                          *
    * (https://sailsjs.com/docs/concepts/deployment/scaling)                   *
    *                                                                          *
    ***************************************************************************/
    // adapter: '@sailshq/socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/databasenumber',
    //--------------------------------------------------------------------------
    // /\   OR, to avoid checking it in to version control, you might opt to
    // ||   set sensitive credentials like this using an environment variable.
    //
    // For example:
    // ```
    // sails_sockets__url=redis://admin:myc00lpAssw2D@bigsquid.redistogo.com:9562/0
    // ```
    //--------------------------------------------------------------------------

  },



  /**************************************************************************
  *                                                                         *
  * Set the production log level.                                           *
  *                                                                         *
  * (https://sailsjs.com/config/log)                                        *
  *                                                                         *
  ***************************************************************************/
  log: {
    level: 'debug'
  },



  http : {

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
          else if(reqString.indexOf("GET /volunteer") !== -1){
            req.session.activeTag = 'volunteer'
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
          else if(reqString.indexOf(" /video-annotation") !== -1){
            req.session.activeTag = 'videolang'
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
  
  },
  



  /**************************************************************************
  *                                                                         *
  * Lift the server on port 80.                                             *
  * (if deploying behind a proxy, or to a PaaS like Heroku or Deis, you     *
  * probably don't need to set a port here, because it is oftentimes        *
  * handled for you automatically.  If you are not sure if you need to set  *
  * this, just try deploying without setting it and see if it works.)       *
  *                                                                         *
  ***************************************************************************/
  // port: 80,



  /**************************************************************************
  *                                                                         *
  * Configure an SSL certificate                                            *
  *                                                                         *
  * For the safety of your users' data, you should use SSL in production.   *
  * ...But in many cases, you may not actually want to set it up _here_.    *
  *                                                                         *
  * Normally, this setting is only relevant when running a single-process   *
  * deployment, with no proxy/load balancer in the mix.  But if, on the     *
  * other hand, you are using a PaaS like Heroku, you'll want to set up     *
  * SSL in your load balancer settings (usually somewhere in your hosting   *
  * provider's dashboard-- not here.)                                       *
  *                                                                         *
  * > For more information about configuring SSL in Sails, see:             *
  * > https://sailsjs.com/config/*#?sailsconfigssl                          *
  *                                                                         *
  **************************************************************************/
  // ssl: undefined,



  /**************************************************************************
  *                                                                         *
  * Production overrides for any custom settings specific to your app.      *
  * (for example, production credentials for 3rd party APIs like Stripe)    *
  *                                                                         *
  * > See config/custom.js for more info on how to configure these options. *
  *                                                                         *
  ***************************************************************************/
 custom : {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // a simple config variable to control the 'logging' mode of the setup
  loggingMode : true,

  // Send "confirm account" email to assure a human user
  verifyEmailAddresses : true,

  // access API from admin-key
  adminKey: process.env.ADMIN_KEY || "admin-12345",
  
  // access API from admin-key
  isDocker: process.env.IS_DOCKER || "NO",

  // admins manage all confidence-level
  confLevel: process.env.MANAGE_LEVEL || "YES",
  
  // restore the back-up file of the destroyed orgs
  restoreOrgs: process.env.RESTORE_ORGS || "NO",

  // force older testing user to become "email-confirmed"
  forceConfirmed: process.env.FORCE_CONFIRM || "NO",

  // config var to be exposed in email-templates
  baseUrl: process.env.BASE_URL || 'http://localhost:1337',

  // our AWS repo base-url
  AWSurl:  "https://easytv-repo-sl.s3.amazonaws.com/",

  video_directory: 'video-submits/',
  mocap_directory: 'mocap-submits/',

  /* easytv authentication token for the API modules inter-communication */
  xEasyTVtoken: "dea005f1143a6626be48e2d4878ecf8538a5dde78996fb673c9663bcb1be5390",
  version: 0.5,
  // confirm-email expires in only 1 minute
  emailProofTokenTTL:  72*60*60*1000,// 24 hours

  ontologyLangs: ['English', 'Spanish', 'Italian', 'Greek'],
  ontologyLangsISO: ['en', 'es', 'it', 'el'],

  langs: ['English', 'Spanish', 'Catalan', 'Arabic', 'Berber'],
  langsISO : ['en', 'es', 'ca', 'ar', 'bb'],

  broadcasterRoles: {"editor": "reviewer", "reviewer": "evaluator", "admin":"admin", "superadmin": "superadmin"},

  LEVELS: {"low": -1, "mid": 1, "high": 5, "professional": 9 },

  /* Levels for registration workflow -- as suggested by the broadcaster*/
  // 'validation pending' is for a fresh member (no visibility)
  // 'test' is for a user that has only "test content" visibility
  confidence_level: {"-2":"validation pending", "-1":"test", "0":"suitable"},

  workflow_levels: {  "-3": "NOT SUITABLE", "-2": "Pending Evaluation", "-1": "Under Evaluation",  0 : "Suitable",
                       1 : 'Archive', 2: 'Archive+', 3: 'Archive++', 4 : 'Archive+++', 
                       5: 'Broadcast', 6: 'Broadcast+', 7: 'Broadcast++', 8: "Broadcast+++", 9:"Professional"},

},

uploads :{
  adapter: require("sails-hook-uploads")
}


};
