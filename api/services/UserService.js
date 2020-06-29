/**
 * Service to fetch single user data from database.
 *
 * @param   {Number|{}} where           Used query conditions
 * @param   {Function}  next            Callback function to call after query
 * @param   {Boolean}   [noExistsCheck] If data is not found, skip error
 */
exports.getUser = function(where, next, noExistsCheck) 
{
  noExistsCheck = noExistsCheck || false;

  User.findOne(where)
    .populate("userOrganisation")
    .exec(function(error, user) 
    {
      if (error) {
        sails.log.error(__filename + ":" + __line + " [Failed to fetch user data]");
        sails.log.error(error);
      } else if (!user && !noExistsCheck) 
      {
        var err = new Error();
        err.status = 404;
        err.message = "User not found.";
        return next(err, next);
      }
      next(error, user);
    });
};

/**
 * Service to fetch users from database
 * sorted by lastNane, firstName, email
 * @param   {{}}        where   Used query conditions
 * @param   {Function}  next    Callback function to call after query
 */
exports.getUsers = function(where, next) 
{
  //sails.log(where);
  User.find()
    .where(where)
    .sort("access ASC")
    .sort("email ASC")
    .populate("userOrganisation")
    .exec(function(error, users) {
      if (error) {
        sails.log.error(error);
        sails.log.error(__filename + ":" + __line + " [Failed to fetch user data]");
      }
      next(error, users);
    });
};

/**
 * Service to fetch single user data from database.
 *
 * @param   {ObjectId}  userId          Used query conditions
 * @param   {Function}  next            Callback function to call after query
 */
exports.getUserLastLogin = function(userId, next) 
{
  Log.find({ user: userId, action: 'LOGIN' })
    .sort("createdAt DESC")
    .limit(1)
    .exec(function(error, user) {
      if (error) {
        sails.log.error(__filename + ":" + __line + " [Failed to fetch user data]");
        sails.log.error(error);
      } else if (!user) {
        error = new Error();
        error.message = "User " + userId + " not found.";
        error.status = 404;
      }
      next(error, user);
    });
};

/**
 * Find which editor users should be notified for a given newly posted job
 * @param   {ObjectId}  newTask   object the new Task to notify for
 */
exports.getUsers2Notify = async function(newTask) 
{
  var editors = await User.find({access:"editor", userOrganisation:newTask.content_owner});
  var users2Notify = [];
  await _.each(editors, async function(user) {
      if(user.settings.emailNewJob == "no"){
      }
      else if(VoluntService.isSuitable(user, newTask.language_target )){
      }
      else if(newTask.confidence_level== "low"){
        var isTested = await VoluntService.isTested( user, newTask.language_target);
        if(isTested)
          users2Notify.push(user);
      }else if(newTask.confidence_level== "mid"){
        var isArchive = await VoluntService.isArchive( user, newTask.language_target);
        if(isArchive)
          users2Notify.push(user);
      }else if(newTask.confidence_level== "high"){
        var isBroadcast = await VoluntService.isBroadcast( user, newTask.language_target);
        if(isBroadcast)
          users2Notify.push(user);
      }
  });
  return users2Notify;
};

/**
 * Service to notify registered user via email
 * ONLY users that match the new job's criteria should get this notification
 * @param   {ObjectId}  newTask  object the new Task to notify for
 */
exports.sendNotifications = async function(newTask) 
{
  if (newTask.action=="edition"){
    var editors = await UserService.getUsers2Notify(newTask);
    //var editors = await User.find({access:"editor", userOrganisation:newTask.content_owner});
    await _.each(editors, async function(editorUser) {
        await sails.helpers.sendTemplateEmail.with({
          to: editorUser.email,
          subject: 'New job from your broadcaster was posted',
          template: 'email-job-post',
          templateData: {
            fullName: User.fullName(editorUser),
            title: newTask.original_title
          }
        });
    });
  }
  else{
    var evaluators = await User.find({access:"reviewer", userOrganisation:newTask.content_owner});
    await _.each(evaluators, async function(reviewerUser) {
      var isBroadcast = await VoluntService.isBroadcast( reviewerUser, newTask.language_target);
      if(isBroadcast)
        await sails.helpers.sendTemplateEmail.with({
            to: reviewerUser.email,
            subject: 'New job is ready for evaluation',
            template: 'email-job-post',
            templateData: {
              fullName: User.fullName(reviewerUser),
              title: newTask.original_title
            }
          });
    });
  }
};

/**
 * Service to notify users about a new task in the task's language
 * @param   {ObjectId}  newTask   object Task to notify for
 */
exports.notifySubscribed = async function(newTask) 
{
    var subs = await Subscribed.find({lang: newTask.lang}).populate("createdBy");
    await _.each(subs, async function(sub) {
        await sails.helpers.sendTemplateEmail.with({
          to: sub.createdBy.email,
          subject: 'New Sign Language task',
          template: 'email-task-post',
          templateData: {
            fullName: User.fullName(sub.createdBy),
            title: newTask.wle
          }
        });
    });

};



/**
* Service to notify Evaluators via email when a job is finished
* @param   {ObjectId}  taskDone   string Task-id to notify for
* @param   {ObjectId}  cont_owner   string cont_owner to notify for
*/
exports.notifyReviewers = async function(taskId, cont_owner) 
{
  //var worker = await User.findOne(workerId);
  var taskDone = await Task.findOne({job_id:taskId, content_owner: cont_owner, action: "edition"});
  if(taskDone){
    var taskOrg = await Organisation.findOne(taskDone.content_owner);
    
    if(taskOrg.jobFinishedNotify && taskDone.confidence_level!="low"){
      var evaluators = await User.find({access:"reviewer", userOrganisation:taskDone.content_owner});
      await _.each(evaluators, async function(evalUser) {
        var isBroadcast = await VoluntService.isBroadcast( evalUser, taskDone.language_target);
        if(isBroadcast)
          await sails.helpers.sendTemplateEmail.with({
              to: evalUser.email,
              subject: 'An '+ taskDone.language_target+' job is ready for evaluation',
              template: 'email-job-100prcnt',
              templateData: {
                fullName: User.fullName(evalUser),
                title: taskDone.original_title,
                jobId: taskDone.job_id
              }
            });
      });
    }

    if(taskOrg.testFinishedNotify && taskDone.confidence_level=="low"){
      var evaluators = await User.find({access:"reviewer", userOrganisation:taskDone.content_owner});
      await _.each(evaluators, async function(evalUser) {
        var isBroadcast = await VoluntService.isBroadcast( evalUser, taskDone.language_target);
        if(isBroadcast)
          await sails.helpers.sendTemplateEmail.with({
              to: evalUser.email,
              subject: 'An '+ taskDone.language_target+' test is ready for evaluation',
              template: 'email-test-100prcnt',
              templateData: {
                fullName: User.fullName(evalUser),
                title: taskDone.original_title,
                jobId: taskDone.job_id
              }
            });
      });
    }
  }
}


/**
* Service to forward feedback-form content to the Admins
* @param   {ObjectId}  taskDone   object feedback to forward
*/
exports.forwardFeedback = async function(feedback, org) 
{
  if(feedback){
    var admins = await User.find({access:"admin", userOrganisation:org.id});
    //if (admins[1]) var ccadmin = admins[1].email; else var ccadmin = "admin@example.com";
    await _.each(admins, async function(adminC) {
      if (adminC.email != "admin@example.com")
        await sails.helpers.sendTemplateEmail.with({
            to: adminC.email,
            subject: 'Forwarding User Feedback!',
            template: 'email-forwd-fdbck',
            templateData: {
              fullName: User.fullName(feedback.user),
              email: feedback.user.email,
              theme: feedback.theme,
              comment: feedback.comment
            }
        });
    });
  }
}

/**
 * Service to auto-assign a previously rejected job
 * @param   {ObjectId}  newTask      object Task to assign
 */
exports.autoAssign = async function(newTask) 
{
    if (newTask.action=="edition")
      var jobType = "editor";
    else
      var jobType= "reviewer";
    
    //var requestingOrg = await Organisation.findOne(newTask.content_owner);
    //if (requestingOrg.editor2Assign)
    //var chosenUser = await User.findOne(requestingOrg.editor2Assign).populate("userOrganisation");
    var usersPool = await User.find({access:jobType, userOrganisation:newTask.content_owner})
                            .populate("userOrganisation").sort("createdAt DESC").limit(1);
    var chosenUser = usersPool[0];

    // POST request to the broadcaster API  -->  sails.log the broadcaster's response message
    var usersOrg = chosenUser.userOrganisation;
    var creds = { user:  chosenUser.id, job_id: newTask.job_id, token: await UtilService.uid(12)}
    var newAssignment = await TaskService.assignUserAJob(usersOrg, creds);
    sails.log(newAssignment);

    if(newAssignment.code == 200)
    {
      // create a DB record about the access triplet "user_id-job_id-token"
      var acclink = await Accesslink.create(creds).fetch();
      // create a new DB record about the statistics of this user on this job
      var jobStatsRecord = await TaskService.saveUserStatistics(newTask, chosenUser.id, chosenUser.access);
      sails.log("Job assigned to user: "+chosenUser.email);
    }
    else
      sails.log("Job assignment failed!");
  
}

/**
 * Process user's language variables upon new member signing-up
 * @param   {ObjectId}  req               request object with input params
 * @param   {ObjectId}  userObj           object User for database
 *  * @param   {ObjectId}  defaultLang    the ISO-code of the org's requested language to know (if any)
 */
exports.getLangParameters = async function(req, userObj, defaultLang) 
{
  var counter = 0;
  var existingLangs = [];
  userObj.lang_info = {langs:[]};

  while (typeof req.param('lang'+counter) !== 'undefined')
  {
    if ( existingLangs.indexOf(req.param('lang'+counter))>-1 ){
      delete req.param('lang'+counter);
      counter++
      continue;
    }
    newlang = {};
    newlang['lang'+counter] = req.param('lang'+counter);
    newlang['level'+counter] = -2;
    userObj.lang_info.langs.push(newlang);
    existingLangs.push(req.param('lang'+counter));
    counter++;
  }
  if(defaultLang!=""){
    newlang = {};
    newlang['lang'+counter] = defaultLang;
    newlang['level'+counter] = 8;
    userObj.lang_info.langs.push(newlang);
  }
  return userObj;
};

/**
 * Process user's language variables upon a user's profile updating
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  req           request object with input params
 */
exports.updateLangParameters = async function(user, req) 
{
  var counter = user.lang_info.langs.length;
  var lang_info = user.lang_info;

  while (typeof req.param('lang'+counter) !== 'undefined')
  {
    newlang = {};
    newlang['lang'+counter] = req.param('lang'+counter);
    newlang['level'+counter] = req.param('level'+counter);
    lang_info.langs.push(newlang);
    counter++;
  }
  return lang_info;
};

/**
 * Update this user's trust level for certain language (admin-only functionality)
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.updateLangLevel = async function(user, langCode, newLevel) 
{
  var counter = 0;
  var prevLevel;
  var lang_info = user.lang_info;
  await _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == langCode){
        prevLevel = userLang['level'+counter];
        userLang['level'+counter] = newLevel;
      }
      counter++;
  });

  /* Trigger an EN3 in case this user goes from 'TESTING' -> 'SUITABLE' */
  if((prevLevel==-2 || prevLevel==-1) && newLevel==0){
    if(user.reg2_token==""){
      var regtoken = await UtilService.uid(12);
      var updUser = await User.updateOne(user.id).set({reg2_token: regtoken}); // create an email-button token
      updUser.userOrganisation = await Organisation.findOne(updUser.userOrganisation);
      await ENService.sendEN(updUser, 3, langCode);
    }
    else
      await ENService.sendEN(user, 3, langCode);
  }

  if(newLevel==-3)
    await ENService.sendEN(user, 5, langCode);

  return lang_info;
};

/**
 * Update this user's trust level for certain language (admin-only functionality)
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.updateLangEvaluator = async function(user) 
{
  var counter = 0;
  var lang_info = user.lang_info;
  _.each(lang_info.langs, function(userLang) {
      userLang['level'+counter] = 9;
      counter++;
  });
  return lang_info;
};

/**
 * Make this user unable to contribute on a certain language (admin-only functionality)
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.blockLang = async function(user, langCode) 
{
  var counter = 0;
  var lang_info = user.lang_info;
  _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == langCode)
        userLang['level'+counter] = -3;
      counter++;
  });

  return lang_info;
};

/**
 * Reverse a previous blocking on a certain language (admin-only functionality)
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.unblockLang = async function(user, langCode) 
{
  var counter = 0;
  var lang_info = user.lang_info;
  _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == langCode)
        userLang['level'+counter] = 1;
      counter++;
  });
  return lang_info;
};
