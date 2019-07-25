/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

module.exports.session = {

  /***************************************************************************
  *                                                                          *
  * Session secret is automatically generated when your new app is created   *
  * Replace at your own risk in production-- you will invalidate the cookies *
  * of your users, forcing them to log in again.                             *
  *                                                                          *
  ***************************************************************************/
 host: '127.0.0.1',
 adapter: 'redis',
 url: process.env.CP_REDIS_HOST || "redis://h:p7f0a0b8a96efe36fd0835a81b9e42ea993b9baa8e1282c67d7ea7dbdd497a9d9@ec2-108-129-69-107.eu-west-1.compute.amazonaws.com:25959",
 
 secret: '4521eb9c88ca3909316c6e254e29c7b1',

  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },


  /***************************************************************************
  *                                                                          *
  * Customize when built-in session support will be skipped.                 *
  *                                                                          *
  * (Useful for performance tuning; particularly to avoid wasting cycles on  *
  * session management when responding to simple requests for static assets, *
  * like images or stylesheets.)                                             *
  *                                                                          *
  * https://sailsjs.com/config/session                                       *
  *                                                                          *
  ***************************************************************************/
  // isSessionDisabled: function (req){
  //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  // },

};
