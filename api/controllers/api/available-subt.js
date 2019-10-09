

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
        testmode: {
            type: 'boolean',
            description: "Force the Crowdsourcing to automatically assign the posted job after few seconds"
        },
        status: {
            type: 'string',
            required: true,
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
          description: 'The job was registered successfully in CP'
        },
    
        invalid: {
          responseType: 'badRequest',
          description: 'There was an internal error while processing the request.'
        },
    
        JobAlreadyExists: {
          statusCode: 409,
          description: 'The provided job_id is already in use.',
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
        sails.log(inputs)
        /*** VALIDATE jobData attributes ***/
        var jobData = inputs.data;
        var existingOrg = await Organisation.find({token: jobData.content_owner.toUpperCase()});
        if (existingOrg.length == 0)
            return exits.errorInAttributes({code:-13, description: 'The provided content_owner is not registered!'})
        else
            jobData.content_owner = existingOrg[0].id;

        var existingJob = await Task.findOne( {job_id: inputs.job_id, content_owner: jobData.content_owner});
        if (existingJob && inputs.action==existingJob.action)
            return exits.JobAlreadyExists({code:-8, description: 'The provided job_id is already in use.'})

        // When requested job_id already exists for a content_owner, then updates its action
        if (existingJob){
            jobData.action = inputs.action;
            jobData.status = inputs.status;
            var reviewJob = await Task.updateOne({ job_id: existingJob.job_id, action: existingJob.action, content_owner: existingJob.content_owner }).set(jobData);
            await Accesslink.destroyOne({job_id: existingJob.job_id});
            await UserService.sendNotifications(reviewJob);
            return exits.success({code:200, description: 'The job is ready for review in CRWD platform'});
        }

        if(typeof jobData.validated_percent != 'number')
            return exits.errorInAttributes({code:-13, description:"invalid data input: validated_percent"});
        if (jobData.validated_percent<0.0 || jobData.validated_percent>100.0)
            return exits.errorInAttributes({code:-13, description:"validated_percent out of limits"});
        if(typeof jobData.publication_date != 'number')
            return exits.errorInAttributes({code:-13, description:"invalid data input: publication_date"});
        if (jobData.publication_date<0 || Number.isInteger(jobData.publication_date)==false)
            return exits.errorInAttributes({code:-13, description:"publication_date is not a valid integer"});
        if(typeof jobData.expiration_date != 'number')
            return exits.errorInAttributes({code:-13, description:"invalid data input: expiration_date"});
        if (jobData.expiration_date<0 || Number.isInteger(jobData.expiration_date)==false)
            return exits.errorInAttributes({code:-13, description:"expiration_date is not a valid integer"});
        if( !UtilService.checkISO_langCode(jobData.language_source) || !UtilService.checkISO_langCode(jobData.language_target) )
            return exits.errorInAttributes({code:-13, description:"language-code is not a valid ISO6391"});
        if (['low','intermediate','high'].indexOf(jobData.confidence_level)<0)
            return exits.errorInAttributes({code:-13, description:"confidence_level value is not vaild (in ['low','intermediate','high'])"});
        if(typeof jobData.original_title != 'string')
            return exits.errorInAttributes({code:-13, description:"invalid data input: original_title"});
        if(typeof jobData.link != 'string')
            return exits.errorInAttributes({code:-13, description:"invalid data input: link"});
        if(typeof jobData.asset_duration != 'string')
            return exits.errorInAttributes({code:-13, description:"invalid data input: asset_duration"});
        if(UtilService.IsValidTime(jobData.asset_duration)==false)
            return exits.errorInAttributes({code:-13, description:"invalid data input: asset_duration"});
        
        jobData.job_id = inputs.job_id;
        jobData.action = inputs.action;
        jobData.status = inputs.status;
        /*** /VALIDATE ***/

        var newCrowdTask = await Task.create(jobData)
                            .intercept( (err)=>{  return exits.serverError({code:-500, description: err.details}); })
                            .fetch();
        //sails.log(newCrowdTask);

        // if POSTED in 'testmode' this job will be automatically assigned with a POST request to the broadcaster's API
        if(inputs.testmode && newCrowdTask){            
            setTimeout(function(){ UserService.autoAssign(newCrowdTask); }, 2 * 1000);
        }

        if(newCrowdTask){
            await UserService.sendNotifications(newCrowdTask);
            return exits.success({code:200, description: 'The job/task was registered successfully in CRWD platform'});
        }
        else
            throw "serverError";
    }
};
  
  

