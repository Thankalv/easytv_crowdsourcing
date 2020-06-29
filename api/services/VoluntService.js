
/**
*  These services are related to the Broadcaster's
*   "Volunteer Recruitment Workflow" document. 
*/

/**
 * Method to check if user can only see the validation-pending page
 * @param   {obj} user                  user Object
 * @param   {Function}  exits            exit function
 */
exports.onlyPending = async function(user, defaultLang) 
{
    var counter = 0;
    var lang_info = user.lang_info;
    var found = true;
    await _.each(lang_info.langs, function(userLang) {
        //sails.log(userLang);
        if( parseInt(userLang['level'+counter]) > -2 && userLang['lang'+counter] != defaultLang)
          found = false;
        counter++;
    });
    return found;
};

/**
 * Method to check if user is allowed for evaluation for a certain language
 * @param   {obj} user                  user Object
 * @param   {Function}  exits            exit function
 */
exports.isTesting = async function(user, lang) 
{
    var counter = 0;
    var lang_info = user.lang_info;
    var found = false;
    await _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == lang)
        if( parseInt(userLang['level'+counter]) ==-1 )
          found = true;
        counter++;
    });
    return found;
};

/**
 * Method to check if user is under evaluation for a certain language
 * @param   {obj} user                  user Object
 * @param   {Function}  exits            exit function
 */
exports.isTested = function(user, lang) 
{
    var counter = 0;
    var lang_info = user.lang_info;
    var found = false;
    _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == lang)
        if( parseInt(userLang['level'+counter]) ==-1 )
          found = true;
        counter++;
    });
    return found;
};

/**
 * Method to check if user is still in evaluation-pending stage for this language
 * @param   {obj} user                  user Object
 * @param   {Function}  exits            exit function
 */
exports.isPending = function(user, lang) 
{
    var counter = 0;
    var lang_info = user.lang_info;
    var found = false;
    _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == lang)
        if( parseInt(userLang['level'+counter]) ==-2 )
          found = true;
        counter++;
    });
    return found;
};

/**
 * Method to check if user is still in evaluation-pending stage for this language
 * @param   {obj} user                  user Object
 * @param   {Function}  exits            exit function
 */
exports.isSuitable = function(user, lang) 
{
    var counter = 0;
    var lang_info = user.lang_info;
    var found = false;
    _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == lang)
        if( parseInt(userLang['level'+counter]) == 0 )
          found = true;
        counter++;
    });
    return found;
};

/**
 * Method to check if a user can access "Archive-level" content
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.isArchive = async function(user, lang) 
{
  var counter = 0;
  var lang_info = user.lang_info;
  var found = false;
  _.each(lang_info.langs, function(userLang) {
    if( userLang['lang'+counter] == lang)
      if( parseInt(userLang['level'+counter]) > 0 )
        found = true;
      counter++;
  });
  return found;
};

/**
 * Method to check if a user can access "Broadcast-level" content
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.isBroadcast = async function(user, lang) 
{
  var counter = 0;
  var lang_info = user.lang_info;
  var found = false;
  _.each(lang_info.langs, function(userLang) {
    if( userLang['lang'+counter] == lang)
      if( parseInt(userLang['level'+counter]) > 4 )
        found = true;
      counter++;
  });
  return found;
};

/**
 * Allow this user to the testing phase (admin-only functionality)
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.allowTesting = async function(user, langCode) 
{
  var counter = 0;
  var lang_info = user.lang_info;
  _.each(lang_info.langs, function(userLang) {
      if( userLang['lang'+counter] == langCode)
        userLang['level'+counter] = -1;
      counter++;
  });

  return lang_info;
};


/**
 * Allow this user to access Archive-level content (admin-only functionality)
 * @param   {ObjectId}  user          object User for database
 * @param   {ObjectId}  langCode      the target language ISO code
 */
exports.toArchive = async function(user, langCode) 
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


