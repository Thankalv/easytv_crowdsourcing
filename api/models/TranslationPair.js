/**
 * TranslationPair.js
 *
 * @description :: model for a under-progress Translation-Pair work
 */
module.exports = {

    schema: true,
    
    attributes: 
    {
        concept1: {
          type: 'string',
          description: "the concept of the right-side video"
        },
        concept2: {
          type: 'string',
          description: "the concept of the left-side video"
        },
        lang1: {
          type: 'string',
          description: "the first language"
        },
        lang2:{
          type: 'string',
          description: "the second language",
        },
        video1: {
          type: 'string',
          description: "the video-for-concept1 created for this pair by the crowd-worker"
        },
        video2: {
          type: 'string',
          description: "the video-for-concept2 created for this pair by the crowd-worker"
        },
        ready: {
          type: 'string',
          description: "NO or YES"
        }
    }
  }