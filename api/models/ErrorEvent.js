/**
 * ErrorEvent.js
 *
 * @description :: flexible data-model to keep track of errors-clients 
 */
module.exports = {

   schema: true,

    attributes: {
        // a descriptive name for the error event
        errorName: {
          type: 'string',
          required: true,
        },

        description: {
          type: 'string',
          required: true,
        },
        // only if 'req.session.User' is defined!
        occurredTo: {
            model: 'user'
        }
    }
}