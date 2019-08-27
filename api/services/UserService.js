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
 * Service to notify registered user via email
 * @param   {ObjectId}  newTask      object Task to notify for
 */
exports.sendNotifications = async function(newTask) 
{
  if (newTask.action=="edition"){
    var editors = await User.find({access:"editor", userOrganisation:newTask.content_owner});
    await _.each(editors, async function(editorUser) {
        await sails.helpers.sendTemplateEmail.with({
          to: editorUser.email,
          subject: 'New job from your collaborative was posted',
          template: 'email-job-post',
          templateData: {
            fullName: User.fullName(editorUser),
            title: newTask.original_title
          }
        });
    });
  }
  else{
    var reviewers = await User.find({access:"reviewer", userOrganisation:newTask.content_owner});
    await _.each(reviewers, async function(reviewerUser) {
      await sails.helpers.sendTemplateEmail.with({
          to: reviewerUser.email,
          subject: 'New job from your collaborative was posted',
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
 * Service to auto-assign a previously rejected job
 * @param   {ObjectId}  newTask      object Task to assign
 */
exports.autoAssign = async function(newTask) 
{
    if (newTask.action=="edition")
      var jobType = "editor";
    else
      var jobType= "reviewer";
    
    var requestingOrg = await Organisation.findOne(newTask.content_owner);
    if (requestingOrg.editor2Assign)
        var chosenUser = await User.findOne(requestingOrg.editor2Assign).populate("userOrganisation");
    else{
      var usersPool = await User.find({access:jobType, userOrganisation:newTask.content_owner})
                            .populate("userOrganisation")
                            .sort("createdAt DESC")
                            .limit(1);
      var chosenUser = usersPool[0];
    }

    // POST request to the broadcaster API  -->  sails.log the broadcaster's response message
    var usersOrg = chosenUser.userOrganisation;
    var creds = { user:  chosenUser.id, job_id: newTask.job_id, token: UtilService.uid(12)}
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
 * @param   {ObjectId}  req          request object with input params
 * @param   {ObjectId}  userObj      object User for database
 */
exports.getLangParameters = async function(req, userObj) 
{
  var counter = 0;
  userObj.lang_info = {langs:[]};

  while (typeof req.param('lang'+counter) !== 'undefined')
  {
    newlang ={};
    newlang['lang'+counter] = req.param('lang'+counter);
    newlang['level'+counter] = req.param('level'+counter);
    userObj.lang_info.langs.push(newlang);
    counter++;
  }
  return userObj;
};

/**
 * Process user's language variables upon user profile updating
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  req           request object with input params
 */
exports.updateLangParameters = async function(user, req) 
{
  var counter = user.lang_info.langs.length;
  var lang_info = user.lang_info;

  while (typeof req.param('lang'+counter) !== 'undefined')
  {
    newlang ={};
    newlang['lang'+counter] = req.param('lang'+counter);
    newlang['level'+counter] = req.param('level'+counter);
    lang_info.langs.push(newlang);
    counter++;
  }
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
        userLang['level'+counter] = 4;
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
