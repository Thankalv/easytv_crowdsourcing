/**
 * UserJobStats.js
 *
 * @description :: UserJobStats model
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,
  
    attributes: {
  
      viewed_percent: {
        type: 'number',
      },
     edited_percent: {
        type: 'number',
      },
      validated_percent: {
        type: 'number',
      },

      asset_duration: {
        type: 'string',
      },

      status: {
        type: 'string',
        required: true
      },
      action: {
        type: 'string',
        isIn: ['edition', 'review'],
        required: true
      },
      /* Associations */
      // belongsTo task
      task: {
         type: 'number',
         required: true
      },
      // belongsTo user
      worker: {
        model: 'user',
        required: true
      }
  
    }
  
  };
  