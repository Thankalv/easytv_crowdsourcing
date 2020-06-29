/**
 * Task.js
 *
 * @description :: video files
 */
module.exports = {
    schema: true,
    
    attributes: 
    {
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
            description: "the job's status according to content owner",
            isIn: [ 'AwaitingForAutomaticTranslation', 'OnAutoTranslation', 'AutoTranslated', 'AwaitingForEdition', 
                    'OnEdition', 'Edited', 'AwaitingForRevision', 'OnRevision', 'Revised', 'CrwEndNotified', 'Finished', 'Rejected', 'CancelRequested', 'Cancelled'],
        },
     
        publication_date: {
            type: 'number',
            description: "the date that the job should be completed. The value is a unix timestamp."
        },

        expiration_date: {
            type: 'number',
            description: "The date that every asset stored regarding this job should be deleted. The value is a unix timestamp."
        },

        content_owner: {
            model: 'Organisation',
            required: true
        },

        language_source: {
            type: 'string',
        },

        language_target: {
            type: 'string',
        },

        confidence_level: {
            type: 'string',
            isIn: ['low','intermediate','mid','high']
        },

        original_title: {
            type: 'string',
        },

        asset_duration: {
            type: 'string',
        },

        preview_link: {
            type: 'string',
            description: "an preview_link (set by the content_owner) that platform allows users to display"
        },

        link: {
            type: 'string',
            description: "an asset link (set by the content_owner) that platform uses during user redirection"
        },

        validated_percent: {
            type: 'number',
            defaultsTo: 0,
            description: "number in %, the progress tracked by the content owner"
        },

        edited_by: {
            model: 'user',
        },

        reviewed_by: {
            model: 'user',
        },

        videos: {
            collection: 'video',
            via: 'task' // change to task
          },
    }
}