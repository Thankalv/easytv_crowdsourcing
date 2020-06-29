
module.exports = {

  friendlyName: "Parse video-annotations",
  description:  "API POST request to submit video-annotations retrieved from the annotation tool",

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: "id of the video to annotate in the app"
    },
    videoURL: {
      type: 'string',
      required: true,
      description: "videoURL of the video to annotate in the app"
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
  },
  exits: {
      success: {
        statusCode : 200,
        description: "The annotations were submitted for this video!"
      },
      notFound: {
        statusCode : 404,
        description: "The job/task status with given job_id was not found"
      },
      errorInAttributes: {
        statusCode: 409,
        description: 'Missing value for required attribute.',
      },
    },

  fn: async function (inputs, exits) 
  {
    sails.log(inputs.duration);
    sails.log(inputs.postcomments);
    var newAnnot = await VideoAnnotated.findOne(inputs.id);
    if(!newAnnot){
      var newAnnot =  await VideoAnnotated.create({ id:inputs.id, video:inputs.videoURL, videoURL:inputs.videoURL, 
                                                sle:inputs.postcomments[0].comments[0], 
                                                wle:inputs.postcomments[0].comments[1],
                                                lang: this.req.session.User.firstLangISO}).fetch()
                                            .intercept( (err)=>{  sails.log(err) });
    }
    // sails.log(newAnnot);

    var annots = {};
    annots['video'] = {};
    if(inputs.videoURL.indexOf("http://")<0)
      annots.video.url = sails.config.custom.baseUrl+inputs.videoURL;
    else 
      annots.video.url = inputs.videoURL;

    annots.video.duration = UtilService.secs2MMSS(inputs.duration);
    annots.video.language = this.req.session.User.firstLangISO ;

    annots.video.segments = await OntologyService.processAnnotations(inputs.postcomments);
    annots.video.sls = await annots.video.segments.map( seg => { return seg.content});   //inputs.postcomments[0].comments[0];
    annots.video.sls = annots.video.sls.join(" ");
    annots.video.nls = await annots.video.segments.map( seg => { if(seg.content2) return seg.content2; else return "";});   //inputs.postcomments[0].comments[0];
    annots.video.nls = annots.video.nls.join(" ");

    sails.log(annots.video.segments);
    // call the API POST for submission and update the corresponding DB record
    var ontoResponse = await OntologyService.annotateVideo(annots); 
    sails.log('Ontology annotation response-code:', ontoResponse);
    //if(ontologyResponse=="Done")
    await VideoAnnotated.updateOne({id:newAnnot.id}).set({segments:annots.video.segments, video:ontoResponse, wle:annots.video.nls, sle:annots.video.sls});
    //await PendingTask.destroyOne({id:inputs.id});

    if(inputs.postcomments)
      exits.success({code:200, description: 'Thank you for submitting!', annotId:newAnnot.id});
    else
      return exits.notFound();
  }  
};