
module.exports = {

    friendlyName: "Parse video-annotations",
    description:  "API POST request to submit video-annotations from the annotation tool",
  
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
        // sails.log(newAnnot);

        var annots = {};
        annots['video'] = {};
        annots.video.url = newAnnot.videoURL;
        annots.video.nls = newAnnot.wle;
        annots.video.sls = newAnnot.sle;
        annots.video.duration = UtilService.secs2MMSS(inputs.duration);
        annots.video.language = newAnnot.lang ;

        annots.video.segments =  [];
        var counter = 1;
        inputs.postcomments.map( annot => {
            var segment = {};
            segment.order = counter;
            segment.start = annot.range.start;
            segment.end = annot.range.end || annot.range.stop;
            segment.content = annot.comments[0];
            if(annot.comments[1])
              segment.content2 = annot.comments[1];
            annots.video.segments.push(segment);
            counter++;
        });

        sails.log(annots.video.segments);
        var ontoResponse = await OntologyService.annotateVideo(annots); 
        sails.log('Ontology annotation response-code:', ontoResponse);
        if(ontoResponse=="Done")
          await VideoAnnotated.updateOne({id:inputs.id}).set({segments:annots.video.segments});

        if(inputs.postcomments)
          exits.success({code:200, description: 'Thank you for submitting!'});
        else
          return exits.notFound();
    }  
};