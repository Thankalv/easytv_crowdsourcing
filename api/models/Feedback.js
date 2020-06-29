/**
 * Feedback.js
 *
 * @description :: Contains the theme and text/html content of a user's feedback-submit, corresponds 1-to-1 to a user
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
      // only filename
      theme: {
        type: 'string',
        required: true,
      },
      // file size in bytes
      comment: {
        type: 'string',
        required: true      
      },
      // belongs to a user
      user: {
        model: 'user',
        required: true
      },
    }
};
  