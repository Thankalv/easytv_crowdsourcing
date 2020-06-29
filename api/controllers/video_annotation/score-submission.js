module.exports = {

    friendlyName: 'Score an SL submission',
    
    inputs: {
      id: {
        type: 'string',
        required: true,
        description: "the id of the videoAnnotated record"
      },
      vscore:{
          type: "number",
          required: true
      }
    },
    exits: {
      success: {
        statusCode: 200,
        description: 'send a success response'
      },
      notEvaluator: {
        statusCode: 401,
        description: 'you are not an evaluator'
      }
    },
  
    fn: async function (inputs,exits) 
    {
      if(this.req.session.User.usertype == "Worker")
        return exits.notEvaluator({});

      sails.log(inputs);
      var videxists = await VideoAnnotated.findOne(inputs.id);
      var newScore = (videxists.vscore * videxists.scorers + inputs.vscore) /( videxists.scorers+1); 
      await VideoAnnotated.updateOne(inputs.id).set( {vscore:newScore, scorers: videxists.scorers+1});

      return exits.success({ response:"score updated"});
    }
  
};