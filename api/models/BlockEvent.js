/**
 * BlockEvent.js
 *
 * @description :: simple data-model to keep track of blocking actions (only admin access)
 */
module.exports = {

   schema: true,

    attributes: {
        // a full block OR a per-language block
        blockType: {
          type: 'string',
          required: true,
        },
        description: {
          type: 'string',
          required: true,
        },
        occurredTo: {
            model: 'user'
        },
        adminBy: {
            model: 'user'
        }
    }
}