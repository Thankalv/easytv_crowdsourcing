/**
 * TaskController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const path = require('path');
const fs = require('fs');
var _ = require('lodash');
var crypto = require('crypto');
var cloudinary = require('cloudinary').v2;
var aws_module = require('aws-sdk');
// cloudinary.config({ cloud_name: 'daadr2nyy', api_key: '495632492568349', api_secret: 'eT5l7nMw1guqEvNe6Vnlx5xtszc' });

module.exports = {

  /**
   * `TaskController.uploadvideo()`
   * Upload a Sign-Language videofile as response to a certain concept (to S3 bucker)
   */
  uploadvideomisc: async function(req, res) 
  {
    req.file('videofile').upload({
      adapter: require('skipper-better-s3'),
      key: 'AKIAIMYKUTYEZZHLYZEQ',
      secret: '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',
      bucket: 'easytv-repo-sl',
      s3params:{ ACL: 'public-read'},
      onProgress: progress => sails.log('Upload progress:', progress)
    }, 
    async function (err, filesUploaded) {
      sails.log(filesUploaded[0].fd);
      if (err) return res.serverError(err);
      var taskObj={
        videoURL: sails.config.custom.AWSurl+filesUploaded[0].fd,
        lang:req.param('lang'),
        wle:req.param("nle")
      }
      var newTask = await PendingTask.create(taskObj).fetch();
      return res.ok({
        files: filesUploaded,
        taskId: newTask.id
      });
    });
  },

  work: function(req, res) 
  {
    res.view({});
  },
    

  list: async function(req, res)
  {
    var tasks = await Task.find({}).populate('videos');
    return res.status(200).json(tasks);
  },

  /*

  */
  uploadtest: function  (req, res) {
    req.file('videofile').upload(function (err, files) {
      if (err)
        return res.serverError(err);

      sails.log(files);
      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });
  },

  /**
   * `TaskController.uploadvideo()`
   * Upload a Sign-Language video-file as response to a certain concept
   */
  uploadvideo: async function(req, res) 
  {
    res.setTimeout(0);
    var dir = path.resolve('.tmp/public/video-submits/');

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
        if (err) {
          return res.send(500, err);
        } 
        else if (uploadedFiles.length === 0) 
        {
          FlashService.error(req, 'No files uploaded');
          return res.send(400, "No file seems to be uploaded");
        }
        else {
          sails.log(uploadedFiles[0].fd);
           //cloudinary.uploader.upload( uploadedFiles[0].fd, {resource_type: "video"} ).then( async function(resCloud){ ... });
          var taskObj = {
            videoURL: '/video-submits/'+uploadedFiles[0].filename,
            lang:req.param('lang'),
            wle:req.param("nle")
          }
          sails.log(path.resolve(dir, uploadedFiles[0].filename));
          if(req.param("taskId"))
            var newTask = await PendingTask.updateOne({id: req.param("taskId")}).set(taskObj);
          else
            var newTask = await PendingTask.create(taskObj).fetch();
          var video = {
            'filename': uploadedFiles[0].filename,
            'size': uploadedFiles[0].size,
            'createdBy': req.session.User.id,
            "taskId" : newTask.id
          };
          UtilService.assetBackUp(uploadedFiles[0].fd, newTask.id, uploadedFiles[0].filename, "videos-bkp/");
          return res.ok(video);
        }
      });
  },

    /**
   * `TaskController.uploadsuggestion()`
   * Upload a Sign-Language video-file as a translation suggestion
   */
  uploadsuggestion: async function(req, res) 
  {
    res.setTimeout(0);
    var dir = path.resolve('.tmp/public/video-submits/');
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
        else if (uploadedFiles.length === 0) {
          FlashService.error(req, 'No files uploaded');
          return res.redirect('/');
        }
        else {
          sails.log(path.resolve(dir, uploadedFiles[0].filename));
          var videoURL = "/"+sails.config.custom.video_directory+uploadedFiles[0].filename;
          await TranslationTask.create({sourceID: req.param('sourceId') , concept: req.param('concept'), videoURL: videoURL});
          return res.ok({videoURL:videoURL});
        }
      });
  },

    /**
   * `TaskController.uploadTranslation()`
   * Upload a Sign-Language video-file as a translation suggestion
   */
  uploadtranslation: async function(req, res) 
  {
    res.setTimeout(0);
    var dir = path.resolve('.tmp/public/video-submits/');
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
        else if (uploadedFiles.length === 0) {
          FlashService.error(req, 'No files uploaded');
          return res.redirect('/');
        }
        else {
          sails.log(path.resolve(dir, uploadedFiles[0].filename));
          var videoURL = "/"+sails.config.custom.video_directory+uploadedFiles[0].filename;
          if(req.param('vid')=="1")
            var pair = await TranslationPair.updateOne({id: req.param('transl-task')}).set({video1:videoURL});
          else
            var pair = await TranslationPair.updateOne({id: req.param('transl-task')}).set({video2:videoURL});
          if (pair.video1!="" && pair.video2!="")
            return res.ok({videoURL:videoURL, ready:"YES" });
          else
            return res.ok({videoURL:videoURL, ready:"NO"});
        }
      });
  },

    /**
   * `TaskController.uploadmocap()`
   * Upload a Sign-Language video-file as response to a certain concept
   */
  uploadmocap: async function(req, res) 
  {
    res.setTimeout(0);
    var dir = path.resolve('.tmp/public/mocap-submits/');

    req.file('mocapfile').upload( // options
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
          return res.redirect('/');
        }
        else 
        {
          // HASHING-MD5: stream-read the file you want to get the hash    
          var fd = fs.createReadStream(uploadedFiles[0].fd);
          var hash = crypto.createHash('md5');
          hash.setEncoding('hex');

          fd.on('end', async function() {
              hash.end();
              var fileHash = hash.read();
              sails.log(fileHash); // the desired sha1sum

              // check video file and create Video
              var mocap = {
                'filename': uploadedFiles[0].filename,
                'size': uploadedFiles[0].size,
                'createdBy': req.session.User.id,
                "existing": "no"
              };
              sails.log(path.resolve(dir, mocap.filename));

              var existingFiles = await VideoAnnotated.find({hashstring:fileHash})
              if(existingFiles.length>0){
                mocap.existing="yes"; 
                mocap.existingAnnot = existingFiles[0].id;
                return res.ok(mocap); 
              }
              var newTask = await PendingTask.updateOne(req.param('taskId')).set({mocapURL: "/"+sails.config.custom.mocap_directory+mocap.filename});

              await VideoAnnotated.updateOne(req.param('taskId')).set({mocapURL: "/"+sails.config.custom.mocap_directory+mocap.filename, hashstring:fileHash})
              UtilService.assetBackUp(uploadedFiles[0].fd, fileHash, uploadedFiles[0].filename, "mocap-bkp/");
              
              mocap["taskId"] = newTask.id;
              return res.ok(mocap);

          });
          // read all file and pipe it (write it) to the hash object
          fd.pipe(hash);
        }
      });
  },

      /**
   * `TaskController.uploadmocap()`
   * Upload a Sign-Language video-file as response to a certain concept
   */
  uploadmocapextra: async function(req, res) 
  {
    res.setTimeout(0);
    var dir = path.resolve('.tmp/public/mocap-submits/');

    req.file('mocapfile').upload( // options
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
          return res.redirect('/');
        }
        else 
        {
          // HASHING-MD5: stream-read the file you want to get the hash    
          var fd = fs.createReadStream(uploadedFiles[0].fd);
          var hash = crypto.createHash('md5');
          hash.setEncoding('hex');

          fd.on('end', async function() {
              hash.end();
              var fileHash = hash.read();
              sails.log(fileHash); // the desired sha1sum

              // check video file and create Video
              var mocap = {
                'filename': uploadedFiles[0].filename,
                'size': uploadedFiles[0].size,
                'createdBy': req.session.User.id,
                "existing": "no"
              };
              sails.log(path.resolve(dir, mocap.filename));

              var existingFiles = await VideoAnnotated.find({hashstring:fileHash})
              if(existingFiles.length>0){
                mocap.existing="yes"; 
                mocap.existingAnnot = existingFiles[0].id;
                return res.ok(mocap); 
              }
              
              await VideoAnnotated.updateOne(req.param('taskId')).set({mocapURL: "/"+sails.config.custom.mocap_directory+mocap.filename, hashstring:fileHash})
              UtilService.assetBackUp(uploadedFiles[0].fd, fileHash, uploadedFiles[0].filename, "mocap-bkp/");

              return res.ok(mocap);
          });
          // read all file and pipe it (write it) to the hash object
          fd.pipe(hash);
        }
      });
  }
  
}
