/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const path = require('path');
const fs = require('fs');
var _ = require('lodash');

module.exports = {

  work: function(req, res) 
  {
    res.view({});
  },
    

  list: async function(req, res)
  {
    var tasks = await Task.find({}).populate('videos');
    return res.status(200).json(tasks);
  },

  /**
   * `TaskController.uploadvideo()`
   * Upload a video-file as response to a certain tasks
   */
  uploadvideo: function(req, res) 
  {
    res.setTimeout(0);
    var dir = path.resolve('assets/work/');

    req.file('videofile').upload( // options
    {
        maxBytes: 1024 * 1024 * 200,
        dirname: dir,
        // save as original filename (overwrites existing one)
        saveAs: function(__newFileStream, cb) {
          cb(null, path.basename(__newFileStream.filename));
        },
    },
     async function whenDone(err, uploadedFiles) 
     {
        sails.log(uploadedFiles[0].fd);

        if (err) {
          return res.send(500, err);
        } 
        else if (uploadedFiles.length === 0) 
        {
          FlashService.error(req, 'No files uploaded');
          return res.redirect('/video');
        }
        else 
        {
          // check video file and create Video
          var video = {
            'filename': uploadedFiles[0].filename,
            'size': uploadedFiles[0].size,
            'createdBy': req.session.User.id,
          };
          // check uploaded video file with ffprobe
          UtilService.probevideo(path.resolve(dir, video.filename), async function(error, data) 
          {
            if (error) 
            {
               sails.log.error('Invalid video file\n', error);
               // remove incomplete/invalid video file
               fs.unlink(path.resolve(dir, video.filename));
               return res.status(500).send('Invalid video file');
            } 
            else 
            {
              // keep a db record of the videofile's detailed info
              video.description = '';
              video.task = req.param('taskId'),
              video.info = JSON.parse(data);
              var thumb = (path.resolve(dir+'/thumbs/', video.filename)+'_thumb.png').split("assets")
              video.thumbnail = thumb[1];

              var vidsWithName = await Video.count({filename:video.filename});
              sails.log('Videos existing with same filename:', vidsWithName);
              if(vidsWithName)
                return res.status(500).send(JSON.stringify({err:"Videos exist with the same filename"}));

              await Video.create(video)
              .intercept((err)=>{ return res.status(500).send(err);})
              .then(function() 
              {
                  UtilService.thumbvideo(path.resolve(dir, video.filename), path.resolve(dir+'/thumbs/', video.filename));
                  sails.log.verbose('Created video ' + video.filename);
                  return res.ok(video);
              });
            }
          });
        }
      });
  },

  
}