
module.exports = {

  friendlyName: 'Subtitle job posting',

  description: 'Registers a new job on the crowdsourcing, indicating the editor or review action associated.',

  inputs: {
    job_id: {
          type: 'number',
          required: true,
          description: "The id of the job created"
      },
      action: {
          type: 'string',
          description: "edition or review"
      },
      status: {
          type: 'string',
          description: "the job's status according to content owner"
      },
      data: {
          type: 'json',
          required: true,
          description: "content owner job details"
      },
   
  },

  exits: {

      success: {
        description: 'The job was updated successfully in CP'
      },
      notFound: {
        statusCode: 404,
        description: 'The job_id was not found.'
      },
      errorInAttributes: {
          statusCode: 400,
          description: 'Error detected in parameters.',
        },
        serverError: {
          statusCode: 500,
          description: 'Error occurred in server.',
        },
    },

  fn: async function (inputs, exits) 
  {
      //sails.log(inputs)
      var existingJob = await Task.findOne( {job_id: inputs.job_id});
      if (!existingJob)
          return exits.notFound({code:-8, description: 'Job_id not found.'})

      /*** VALIDATE jobData attributes ***/
      var jobData = inputs.data;

      var existingOrg = await Organisation.find( {token: jobData.content_owner});
      if (existingOrg.length == 0)
          return exits.errorInAttributes({code:-13, description: 'The provided content_owner is not registered!'})
      else
          jobData.content_owner = existingOrg[0].id;

      if( jobData.validated_percent!= undefined && typeof jobData.validated_percent != 'number')
          return exits.errorInAttributes({code:-13, description:"invalid data input: validated_percent"});
      if (typeof jobData.validated_percent == 'number' && (jobData.validated_percent<0.0 || jobData.validated_percent>100.0))
          return exits.errorInAttributes({code:-13, description:"validated_percent out of limits"});
      if (typeof jobData.publication_date == 'number' && (jobData.publication_date<0 || Number.isInteger(jobData.publication_date)==false))
          return exits.errorInAttributes({code:-13, description:"publication_date is not a valid integer"});
      if (typeof jobData.expiration_date == 'number' && (jobData.expiration_date<0 || Number.isInteger(jobData.expiration_date)==false))
          return exits.errorInAttributes({code:-13, description:"expiration_date is not a valid integer"});
      if(jobData.language_source!= undefined && !UtilService.checkISO_langCode(jobData.language_source))
        return exits.errorInAttributes({code:-13, description:"language-code is not a valid ISO6391"});
      if(jobData.language_target!= undefined && !UtilService.checkISO_langCode(jobData.language_target))
          return exits.errorInAttributes({code:-13, description:"language-code is not a valid ISO6391"});
      if (jobData.confidence_level!= undefined && ['low','intermediate','high'].indexOf(jobData.confidence_level))
          return exits.errorInAttributes({code:-13, description:"confidence_level value is not vaild (in ['low','intermediate','high'])"});
      if(jobData.original_title != undefined && typeof jobData.original_title != 'string')
          return exits.errorInAttributes({code:-13, description:"invalid data input: original_title"});
      if(typeof jobData.asset_duration == 'string' && UtilService.IsValidTime(jobData.asset_duration)==false)
          return exits.errorInAttributes({code:-13, description:"invalid data input: asset_duration"});
      if(jobData.link != undefined && typeof jobData.link != 'string')
          return exits.errorInAttributes({code:-13, description:"invalid data input: original_title"});

      jobData.job_id = inputs.job_id;
      /*** /VALIDATE ***/

      var updCrowdTask = await Task.updateOne({ job_id: inputs.job_id, content_owner: jobData.content_owner}).set(jobData)
                             .intercept( (err)=>{  return exits.serverError({code:-500, description: err.details}); })
      
      if(updCrowdTask)
        return exits.success({code:200, description: 'The job was updated successfully in CRWD database'});
      else
        return exits.serverError({code:-500, description: "Undefined error occurred"});
  }


};
