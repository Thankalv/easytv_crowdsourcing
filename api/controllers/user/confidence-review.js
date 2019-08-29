
module.exports = {

    friendlyName: 'GET users-list for confidence modification',
    description: "An Evaluator of a certain job can revise the confidence of previous 'Reviewer' users of this same job",

    inputs: {
        job_id: {
            description: "The id of the job under evaluation",
            type: 'string'
          },
          lang_source: {
            description: "the source language of this job",
            type: 'string'
          },
          lang_target: {
            description: "the target language of this job",
            type: 'string'
          },
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'returns a user-listing page',
            viewTemplatePath: "user/confidence-review"
          },
      },

    fn: async function (inputs) 
    {
      var isJobUnderReview = await Accesslink.findOne({user: this.req.session.User.id, job_id: inputs.job_id})

      // ONLY an evaluator that's currently working on this job_id is able to modify the contibuting user's confidence
      var prevUsersList = [];
      var prevUsers = [];
      // parse the 'JobsStats' records, and return the previous users that have contributed to this one
      if(this.req.session.User.access=="reviewer" && isJobUnderReview)
      {
            var prevStats = await UserJobStats.find({task: inputs.job_id, action:"edition"}).populate("worker");
            await _.each(prevStats, async function(prevStat) {
              if(prevStat.worker)
                if (prevUsersList.indexOf(prevStat.worker.id)<0){
                    prevUsersList.push(prevStat.worker.id);
                    var counter = 0;
                    await _.each(prevStat.worker.lang_info.langs, function(userLang) {
                      if( userLang['lang'+counter] == inputs.lang_source)
                        prevStat.worker.lang_source_lvl = userLang['level'+counter];
                      if( userLang['lang'+counter] == inputs.lang_target)
                        prevStat.worker.lang_target_lvl = userLang['level'+counter];
                      counter++;
                    });
                    prevUsers.push(prevStat.worker);
                }
            });
            return { job_id: inputs.job_id,
                     prevUsers: prevUsers,
                     lang_source: inputs.lang_source,
                     lang_target: inputs.lang_target,
                     langs: sails.config.custom.langs,
                     langsISO: sails.config.custom.langsISO,
                     levels: [ { num: 1, description: 'Junior'},
                            { num: 2, description: 'Intermediate'},
                            { num: 3, description: 'Proficiency'},
                            { num: 4, description: 'Blocked'}]
                    };
      }
      else{
        FlashService.error(this.req, 'You cannot access the users of this job!');
        return this.res.redirect('/');
      }
    }
  
};