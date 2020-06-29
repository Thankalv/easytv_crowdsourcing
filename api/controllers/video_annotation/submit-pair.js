module.exports = {
  friendlyName: "Parse video-annotations",
  description:  "API POST-request to submit video-annotations using the annotation interface",

  inputs: {
    video1: {
      type: 'json',
      required: true,
      description: "the info of video1"
    },
    video2: {
      type: 'json',
      required: true,
      description: "the info of video2"
    }
  },
  exits: {
      success: {
        statusCode : 200,
        description: "The translation was submitted for this video!"
      }
    },

  fn: async function (inputs, exits) 
  {
      sails.log(inputs.video1);
      sails.log(inputs.video2);

      /* --- video-1 --- */
      var video1 = {};
      video1.url = sails.config.custom.baseUrl+"/"+inputs.video1.videoURL;
      video1.nls = inputs.video1.concept;
      video1.duration = UtilService.secs2MMSS(inputs.video1.duration);
      video1.language = inputs.video1.lang;
      video1.segments = await OntologyService.processAnnotations(inputs.video1.postcomments); 
      video1.sls = await video1.segments.map( seg => { return seg.content});   //inputs.postcomments[0].comments[0];
      video1.sls = video1.sls.join(" ");
      //sails.log(video1);
      sails.log(video1.segments);

      /* --- video-2 --- */
      var video2 = {};
      video2.url = sails.config.custom.baseUrl+"/"+inputs.video2.videoURL;
      video2.nls = inputs.video2.concept;
      video2.sls = inputs.video2.concept;
      video2.duration = UtilService.secs2MMSS(inputs.video2.duration);
      video2.language = inputs.video2.lang;
      video2.segments = await OntologyService.processAnnotations(inputs.video2.postcomments);
      video2.sls = await video2.segments.map( seg => { return seg.content});   //inputs.postcomments[0].comments[0];
      video2.sls = video2.sls.join(" ");
      sails.log(video2.segments);
      //var newRecord = await VideoAnnotated.create({video:video2.videoURL,videoURL:video2.url, sle: video2.sls, wle: video2.nls, lang:targetLang, segments:video2.segments}).fetch()
      //                                     .intercept( (err)=>{  sails.log(err) });

      var ontoRes = await OntologyService.postTranslation(video1, video2);
      sails.log(ontoRes);
      await TranslationPair.updateOne({video1:video1.url, video2:video2.url}).set({ready:"YES"});

      return exits.success({code:200, description: 'Thank you for submitting a new translation!'});
  }  
};