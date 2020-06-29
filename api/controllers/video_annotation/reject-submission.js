module.exports = {

    friendlyName: 'Reject and remove an SL submission',
    
    inputs: {
      id: {
        type: 'string',
        required: true,
        description: "the id of the videoAnnotated record"
      },
      reason:{
        type:"string",
        description: "evaluator may give a reason for this rejection"
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
      },
    },
  
    fn: async function (inputs,exits) 
    {
      if(this.req.session.User.usertype == "Worker")
        return exits.notEvaluator({});

      sails.log(inputs);
      var videxists = await VideoAnnotated.findOne(inputs.id);
      videxists.video = videxists.video.replace("page/", "")

      var ontoResponse = await OntologyService.removeFromGraph( videxists.video );
      sails.log(ontoResponse);

      if(ontoResponse=="error"){
        FlashService.warn(this.req, "sorry, the Ontology-Service seems currently down");
        return this.res.redirect("/video-annotation/show-submissions");
      }else{
        await VideoAnnotated.destroyOne(inputs.id);
        return exits.success({ response:"submission rejected"});
      }

    }
  
};