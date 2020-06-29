/**
*
* collection of function for processing string/numbers, 
* to be used in .ejs Javascript
*/

var moment = require('moment');
var child_process = require('child_process');
var ISO6391 = require('iso-639-1')
var striptags = require('striptags');
const fs = require('fs');
////////////////////////////////////////////////////////////////////////////

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

////////////////////////////////////////////////////////////////////////////

module.exports = {

  fromNow: function(s) {
    return moment(s).fromNow();
  },
  
  to_hhmmss_ddmmyyyy: function(s) {
    return moment(s).format("DD/MM/YYYY hh:mm:ss")
  },

    /**
   * [truncStripTags strip html tags and put ... after msg]
   * @param  {[type]} message [display msg]
   * @param  {[type]} n       [max chars]
   * @return {[type]}         [description]
   */
  truncStripTags: function(message, n) {
    // striptags(html, allowedTags);
    if (_.isUndefined(message)) return '';
    var str = striptags(message.trim(), [], ' ');
    return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
  },


  // return a list of duplicates from an existing list
  findDuplicates: async function(arr) {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
   },

   /**
   * Return a unique identifier with the given `len`.
   *
   *     utils.uid(10);
   *     // => "FDaS435D2z"
   *
   * @param {Number} len
   * @return {String}
   * @api private
   */
  uid: async function(len) {
    var buf = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      charlen = chars.length;

    for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join('');
  },

  /**
   * [uidLight description]
   * @param  {[type]} len [description]
   * @return {[type]}     [description]
   */
  uidLight: function(len) {
    var buf = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      charlen = chars.length;

    for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
  },
 

  /**
  * [probevideo description]
  * @param  {[type]}   video [description]
  * @param  {Function} next  [description]
  */
  probevideo: function(video, next) 
  {
    // get video file info from ffprobe
    var filepath = video;
    var cmd = 'ffprobe -v quiet  -print_format json -show_format -show_streams "' + filepath + '"';
    opts = {
      cwd: sails.config.appPath
    };
    sails.log.debug('Running', cmd, opts);
    child_process.exec(cmd, opts, function(error, stdout, stderr) 
    {
      if (stderr) {
        //sails.log.warn('stderr:', stderr);
      }
      // sails.log(stdout);
      if (error)
        return next(error, stdout);
      else
        return next(null, stdout);
    });

  },
  
  /**
   * [thumbvideo description]
   * @param  {[type]}   video    [full path to the videofile]
   * @param  {[type]}   filepath [path to the thumbs' directory]
   * @param  {Function} next     [the callback function]
   */
  thumbvideo: function(video, filepath, next) 
  {
    // get video file info from ffprobe
    var cmd = 'ffmpeg -i '+video+' -vf  "thumbnail,scale=75:75" -frames:v 1 '+filepath+'_thumb.png';
    opts = {
      cwd: sails.config.appPath
    };

    sails.log.debug('Thumbnailing', cmd, opts);
    child_process.exec(cmd, opts, function(error, stdout, stderr) 
    {
      if (error) {
         sails.log.error('error', error);
      }
      if (stderr) {
         //sails.log.warn('stderr:', stderr);
      }
      else{
        sails.log('Thumbnailing completed!!!');
      }
    });  
  },

  /* Convert seconds to HHMMSS format string*/
  secs2HHMMSS: function(totalSec) {
    totalSec = totalSec.toFixed(0);
    var hours = parseInt(totalSec / 3600) % 24;
    var minutes = parseInt(totalSec / 60) % 60;
    var seconds = totalSec % 60;
    // var hours = parseInt(totalSec) / 3600) % 24;
    // var minutes = (parseInt(totalSec) / 60) % 60;
    // var seconds = parseInt(totalSec) % 60;
    var result = (hours < 10 ? "0" + hours : hours) + ":" + 
                (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                (seconds < 10 ? "0" + seconds : seconds);
    return result;
  },

  /* Convert seconds to MMSS format string*/
  secs2MMSS: function(totalSec) {
      if (typeof totalSec === 'string' || totalSec instanceof String)
        return totalSec;
      totalSec = totalSec.toFixed(0);
      var minutes = parseInt(totalSec / 60) % 60;
      var seconds = totalSec % 60;
      var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                  (seconds < 10 ? "0" + seconds : seconds);
      return result;
  },
  
  sortByKey: async function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  },
  sortByKeyUp: async function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  },

  cleanTitles: async function(job){
     var tmp = job['asset_name'].toString();
     let copySpread = await UtilService.cloneJob(job);
     delete copySpread.asset_name;
     delete copySpread.reject_reason;
     job['clJob'] = copySpread;
     job['asset_name'] = tmp;
     return job;
  },

  cloneJob: async function(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = await UtilService.cloneJob(obj[key]);

    return temp;
  },

  filterByLang: async function(jobs, user) {
    var userLangs = [];
    var langLevels = [];
    var counter = 0;
    await _.each(user.lang_info.langs, lang => {
      userLangs.push(lang["lang"+counter]);
      langLevels.push(lang["level"+counter]);

      counter++;
    });

    var filteredJobs = [];
    var counter = 0;
    await _.each(jobs, ajob => {
      if (userLangs.indexOf(ajob.language_source)>-1)
        if (userLangs.indexOf(ajob.language_target)>-1) {
          var langsource = userLangs.indexOf(ajob.language_source);
          var langtarget = userLangs.indexOf(ajob.language_target);
          var jobConfidence = sails.config.custom.LEVELS[ajob.confidence_level.toLowerCase()];
          if (langLevels[langsource] >= jobConfidence && langLevels[langtarget] >= jobConfidence)
            filteredJobs.push(ajob);
        }
    });
    //sails.log(userLangs)
    //sails.log(filteredJobs);
    return filteredJobs;
  },

  /* Confirm that a 2char lang-code is valid ISO6391*/
  checkISO_langCode: function(langcode) {
    if(ISO6391.validate(langcode) || ['bb'].indexOf(langcode)>-1)
      return true;
    else
      return false;
  },

  IsValidTime: function(timeString){
      var pattern = /^(?:1[0-2]|0?[0-9]):[0-5][0-9]:[0-5][0-9]$/;
      if (!timeString.match(pattern))
          return false;
      else
        return true;
  },

  assetBackUp: async function(filepath, fileId, filename, folder){
    const options = {      
      key: 'AKIAIMYKUTYEZZHLYZEQ',
      secret: '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',
      bucket: 'easytv-repo-sl',
      s3params:{ ACL: 'public-read'},
      onProgress: progress => sails.log('Upload progress:', progress)
    }
    // Create and configure an adapter
    const adapter = require('skipper-better-s3')(options)
    // All files will be saved to this S3 directory (this configuration object is optional)
    const receiver = adapter.receive({s3params:{ ACL: 'public-read', Key: folder+fileId, Metadata: {id:fileId, filename:filename} }});
    // Suppose we want to upload a file which we temporarily saved to disk
    const file = fs.createReadStream(filepath);
    receiver.write(file, async () => {
      // Upload complete! You can find some interesting info on the stream's `extra` property
      //sails.log(file.extra);
      if(folder.indexOf("mocap")>-1)
        await VideoAnnotated.updateOne({hashstring:fileId}).set({mocapBCKP: file.extra["Location"]});
      else
        await PendingTask.updateOne(fileId).set({videoBCKP: file.extra["Location"]});
    })
  }
}
