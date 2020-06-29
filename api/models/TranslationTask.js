/**
 * TranslationTask.js
 *
 * @description :: model for a pending Sign Language translation-task
 */
module.exports = {

    schema: true,
    
    attributes: 
    {
        sourceID: {
          type: 'string',
          description: "the id of the existing VideoAnnotated to be translated"
        },
        videoURL: {
          type: 'string',
          description: "the videoURL that was created by the crowd-worker as a translation-suggestion"
        },
        targetID: {
          type: 'string',
          description: "the id of the assigned VideoAnnotated translation"
        },
        targetLang:{
          type: 'string',
          description: "the language to translate to"
      },
      concept:{
        type: 'string',
        description: "the natural language concept"
      }
    }
  }