/**
 * Subscribed.js
 *
 * @description :: a user subscription in Sign-Language tasks
 */
module.exports = {

    schema: true,
    
    attributes: 
    {
        lang: {
            type: 'string'
          },
        // by a user
        createdBy: {
            model: 'user',
            required: true
          }
    }
}