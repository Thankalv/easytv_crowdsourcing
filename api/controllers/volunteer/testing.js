
module.exports = {

    friendlyName: 'users dsplays the currently available "test" content for this language',
    inputs: {
        lang: {
            type: 'string',
            description: 'The language under evaluation'
        }
    },
    exits: {
        success: {
            statusCode: 200,
            description: 'return a page with the available testing-content',
            viewTemplatePath: 'volunteer/testing'
        },
        },

    fn: async function (inputs, exits) 
    {
        var langs = sails.config.custom.langs;
        var langsISO = sails.config.custom.langsISO;

        var isTesting = await VoluntService.isTesting(this.req.session.User, inputs.lang);
        if(isTesting==false){
            FlashService.warn(this.req, "You are not in evaluation phase for this language"); 
            return this.res.redirect('/'); 
        }
        var usersOrg = this.req.session.User.userOrganisation;
        var jobType = this.req.session.User.access;
        var test_jobs = await TaskService.getTestsFromBroadcaster(usersOrg, jobType, inputs.lang);
        test_jobs = await UtilService.sortByKeyUp(test_jobs, "job_id");
        test_jobs = await UtilService.filterByLang(test_jobs, this.req.session.User);
        //sails.log(test_jobs);

        var assignedJobs = await Accesslink.find();
        var userAssignedJobs = await Accesslink.find( {user: this.req.session.User.id} );
        var userAssignedJobsList = await userAssignedJobs.map( ajob => { return ajob.job_id});

        var assignedJobsList = await assignedJobs.map( ajob => { return ajob.job_id});
        var testJobs = [];
        var assignedTest = 'none';
        await _.each(test_jobs, async function(ajob) {
            if (userAssignedJobsList.indexOf(ajob.job_id)>-1){
                ajob.accesslink = userAssignedJobs[userAssignedJobsList.indexOf(ajob.job_id)];                
                assignedTest = ajob;
            }
            else
                if (assignedJobsList.indexOf(ajob.job_id)<0) 
                    testJobs.push(ajob);
        });

        for(var i = 0; i < testJobs.length; i++) {
            testJobs[i] = await UtilService.cleanTitles(testJobs[i]);
          }

        return exits.success({ langcode: inputs.lang, 
                               testJobs:testJobs, job:assignedTest, 
                               targetLang: langs[langsISO.indexOf(inputs.lang)] });
    }  
};