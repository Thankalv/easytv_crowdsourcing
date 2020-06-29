/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

module.exports = {

  // Any configuration settings may be overridden below, whether it's built-in Sails
  // options or custom configuration specifically for your app (e.g. Stripe, Mailgun, etc.)

  /* easytv authentication token for the API modules intercommunication */
  xEasyTVtoken: "dea005f1143a6626be48e2d4878ecf8538a5dde78996fb673c9663bcb1be5390",

  //explicitHost: '195.251.117.235',
  port: process.env.PORT || 1337,

  version: 0.5,

};
