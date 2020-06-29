module.exports = {

    friendlyName: 'Verify a suggested SL video/translation',
    
    inputs: {
      vid1: {
        type: 'json',
        required: true,
        description: "the json-object of the source video"
      },
      vid2: {
        type: 'json',
        required: true,
        description: "the json-object of the suggested translation video"
      },
      score: {
        type: 'number',
        required: true,
        description: "the user verification score"
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'send a json success response'
      },
    },
  
    fn: async function (inputs) 
    {
      delete inputs.vid1.segments;
      delete inputs.vid2.segments;
      delete inputs.vid1.id;
      delete inputs.vid2.id;
      delete inputs.vid1.video;
      delete inputs.vid2.video;
      sails.log(inputs);
      
      var ontoResponse = await OntologyService.evaluateTranslation( inputs.vid1, inputs.vid2, inputs.score);
      sails.log(ontoResponse);

      return {data:"thanks"}
    }
  
};