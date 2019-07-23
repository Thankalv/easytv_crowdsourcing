
module.exports = {

    friendlyName: "Parse video-annotations",
  
    description:  "API POST request to submit video-annotations from the annotation tool",
  
    inputs: 
    {
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
        sails.log(inputs.postcomments);

        var annots = {};
        annots.video = {};
        annots.url = "http://nlp-easytv.oeg-upm.net/video/en/5.mp4";
        annots.nls = "Climate";
        annots.sls = "Climate";
        annots.duration = "00:03";
        annots.language = "en" ;
        annots.segments =  [{
                "order": "1",
                "start": "00:00",
                "end" : "00:03",
                "content" : "Climate"
              }
           ];
        

       var ontoResponse = await OntologyService.annotateVideo(annots); 
       sails.log('Ontology annotation response-code:', ontoResponse);


        if(inputs.postcomments)
            exits.success({code:200, description: 'Thank you for submitting!'});
        else
            return exits.notFound();

    }
  
  };
  