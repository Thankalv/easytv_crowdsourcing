
module.exports = {

  friendlyName: "Parse video-annotations",
  description:  "API POST request to submit video-annotations retrieved from the annotation tool",

  inputs: {
    videoSrc: {
      type: 'json',
      required: true,
      description: "the source video to be translated"
    },
    videoURL: {
      type: 'string',
      required: true,
      description: "videoURL of the suggested translation"
    },
    vid2id: {
      type: 'string',
      required: true,
      description: "id of the suggested translation record"
    },
    duration: {
      type: 'number',
      required: true,
      description: "html5 video's duration in seconds"
    },
    postcomments: {
        type: 'json',
        required: true,
        description: "A list of annotations"
    },
    concept: {
      type: 'string',
      required: true,
      description: "the translation concept in NL"
    },
    targetLang: {
      type: 'string',
      required: true,
      description: "the translation language"
    },
  },
  exits: {
      success: {
        statusCode : 200,
        description: "The translation was submitted for this video!"
      }
    },

  fn: async function (inputs, exits) 
  {
      var langs = sails.config.custom.ontologyLangs;
      var langsISO = sails.config.custom.ontologyLangsISO;

      /* --- video-1 --- */
      var video1 = {};
      video1.url = sails.config.custom.baseUrl+inputs.videoSrc.videoURL;
      video1.nls = inputs.videoSrc.wle;
      video1.sls = inputs.videoSrc.sle;
      video1.duration = UtilService.secs2MMSS(inputs.videoSrc.duration);
      video1.language = langsISO[langs.indexOf(inputs.videoSrc.lang)];
      video1.segments = inputs.videoSrc.segments;

      sails.log(video1);
      sails.log(inputs.postcomments);
      var targetLang =  langsISO[langs.indexOf(inputs.targetLang)];

      /* --- video-2 --- */
      var video2 = {};
      video2.url = sails.config.custom.baseUrl+inputs.videoURL;
      video2.segments = await OntologyService.processAnnotations(inputs.postcomments); 
      video2.sls = await video2.segments.map( seg => { return seg.content});   //inputs.postcomments[0].comments[0];
      video2.sls = video2.sls.join(" ");
      video2.nls = inputs.concept;
      video2.duration = UtilService.secs2MMSS(inputs.duration);
      video2.language = targetLang;
      sails.log(video2);

      var newRecord = await VideoAnnotated.create({id:inputs.vid2id, video:video2.url,videoURL:video2.url, 
                                                  sle: video2.sls, wle: video2.nls, lang:targetLang, segments:video2.segments}).fetch()
                                            .intercept( (err)=>{  sails.log(err) });

      var ontoRes = await OntologyService.postTranslation(video1, video2);
      sails.log(ontoRes);
      await TranslationTask.updateOne({sourceID:inputs.videoSrc.id}).set({targetID:newRecord.id, targetLang:targetLang});

      if(inputs.postcomments)
        exits.success({code:200, description: 'Thank you for submitting a new translation!'});
      else
        return exits.notFound();
  }  
};