module.exports = {

    friendlyName: 'a reviewer',
    inputs: {},
    exits: {
        success: {
            statusCode: 200,
            description: 'display to Evaluator a page with testing-content',
            viewTemplatePath: 'volunteer/evaluation'
        }
    },

    fn: async function (inputs, exits) 
    {
        var jobType = this.req.session.User.access;
        if(jobType!="reviewer"){
            FlashService.warn(this.req, "You are not an Evaluator member of this organisation"); 
            return this.res.redirect('/'); 
        }

        var evaluatorOrg = this.req.session.User.userOrganisation;
        var test_jobs = await TaskService.getTestsFromBroadcaster(evaluatorOrg, jobType, inputs.lang);
        test_jobs.testJobs = await UtilService.sortByKeyUp(test_jobs.testJobs , "job_id");
        test_jobs.reviewJobs = await UtilService.sortByKeyUp(test_jobs.reviewJobs , "job_id");
        test_jobs.testJobs = await UtilService.filterByLang(test_jobs.testJobs, this.req.session.User);
        test_jobs.reviewJobs = await UtilService.filterByLang(test_jobs.reviewJobs, this.req.session.User);

        var assignedJobs = await Accesslink.find().populate("user");
        var userAssignedJobs = await Accesslink.find( {user: this.req.session.User.id} );
        var userAssignedJobsList = await userAssignedJobs.map( ajob => { return ajob.job_id});
        sails.log(userAssignedJobsList);
        var progressStats = await UserJobStats.find({action: "edition"}).sort("updatedAt DESC");
        var usersWorked = await progressStats.map( stat => { return stat.task});
        //sails.log(usersWorked);

        var assignedJobsList = await assignedJobs.map( ajob => { return ajob.job_id});
        var testJobs = [];
        var assignedTest = 'none';
        await _.each(test_jobs.testJobs, async function(ajob) {
            if (assignedJobsList.indexOf(ajob.job_id)>-1) {
                var lindex = assignedJobsList.indexOf(ajob.job_id);
                ajob.worker = assignedJobs[lindex].user;
                //sails.log(ajob.worker);
                testJobs.push(ajob);
            }
        });
        await TaskService.getJobsProgress(testJobs);

        var reviewJobs = [];
        await _.each(test_jobs.reviewJobs, async function(ajob) {
            if (userAssignedJobsList.indexOf(ajob.job_id)>-1){
                ajob.accesslink = userAssignedJobs[userAssignedJobsList.indexOf(ajob.job_id)];
                if (progressStats[usersWorked.indexOf(ajob.job_id)])
                    ajob.prevWorker = progressStats[usersWorked.indexOf(ajob.job_id)].worker;         
                assignedTest = ajob;
            }
            // display the un-assigned jobs that are ready for EVALUATION
            if (assignedJobsList.indexOf(ajob.job_id)<0)
                reviewJobs.push(ajob);
        });

        await TaskService.getJobsProgressReviewer(reviewJobs);
        
        if (assignedTest != 'none')
            assignedTest = await UtilService.cleanTitles(assignedTest);

        for(var i = 0; i < reviewJobs.length; i++) {
            reviewJobs[i] = await UtilService.cleanTitles(reviewJobs[i]);
          }

        return exits.success({
                  langcode: inputs.lang,
                  testJobs: testJobs, 
                  reviewJobs: reviewJobs,
                  job:assignedTest
            });
    }  
};