
/**
 * /api/services/OntologyService.js
 *
 * Integration with EasyTv-annotator API (developed by: "oeg-upm.net") related services
 */

var _ = require('lodash');
var reqProm = require('request-promise');
var moment = require("moment");

module.exports = {

    /* 
      GET the existing translations from the easytv-annotator API
    */
   getVideos: async function()
   {
       var options = {};
       options.method = 'GET';
       options.uri = "http://api.easytv.linkeddata.es/easytv-annotator/getAllVideos",
       options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
       options.json = true;   // Automatically parses the JSON string in the response

       var videosAnnotated =  await reqProm(options).catch(
         function(err) { sails.log.error('EasyTv-annotator GET errorcode: '+ err.statusCode + " with message:" + err.message)
       });

       return videosAnnotated;
   },

   /* start-up routine to sync our Sign-Language video database with the Ontology back-end */
   updateLocalDB: async function()
   {
    var ontoVideos = await VideoAnnotated.find();
    await _.each(ontoVideos, async function(ontoVid) { 
      ontoVid.video = ontoVid.video.replace("page/", "");
      await VideoAnnotated.updateOne(ontoVid.id).set({video:ontoVid.video});
    });
    var annotsURLs = await ontoVideos.map( ontoVid => { return ontoVid.video});
    var newAnnots = await OntologyService.getVideos();
    // sails.log(annotsURLs);
    if(newAnnots){
      await _.each(newAnnots.videos, async function(annot) {
        if(annotsURLs.indexOf(annot.video)<0){
            sails.log(annot);
            if(annot.videoURL.indexOf('/el/')>-1)
              annot.lang = 'el';
            else if(annot.videoURL.indexOf('/es/')>-1)
              annot.lang = 'es';
            else if(annot.videoURL.indexOf('/it/')>-1)
              annot.lang = 'it';
            else if(annot.videoURL.indexOf('/en/')>-1)
              annot.lang = 'en';
            await VideoAnnotated.create(annot)
              .intercept( (err)=>{  sails.log(err) });
        }
      });
    }
    return;
   },

    /* 
      Categorize this Sign-Language video to a certain category
    */
    tagVideo: async function(id, userconcept)
    {
        await VideoAnnotated.updateOne({id:inputs.id}).set({concept:userconcept});
    },

    /* 
    * Evaulate a suggested translation
    */
    evaluateTranslation: async function(vid1, vid2, score)
    {
        var options = {};
        options.method = 'POST';
        options.uri = "http://api.easytv.linkeddata.es/easytv-annotator/verifyTranslations",
        options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
        options.body = { video1:vid1, video2:vid2, confidence:score};
        options.json = true;   // Automatically parses the JSON string in the response

        var ontologyAnnot =  await reqProm(options).catch(
          function(err) { sails.log.error('Annotations POST errorcode: '+ err.statusCode + " with message:" + err.message)
        });

        return ontologyAnnot;
    },

    /**
     *  POST the submission to the easytv-annotator API
    */
    annotateVideo: async function(annotations)
    {
        var options = {};
        options.method = 'POST';
        options.uri = "http://api.easytv.linkeddata.es/easytv-annotator/annotateVideo",
        options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
        options.body = annotations;
        options.json = true;   // Automatically parses the JSON string in the response

        var ontologyAnnot =  await reqProm(options).catch(
          function(err) { sails.log.error('Annotations POST errorcode: '+ err.statusCode + " with message:" + err.message)
        });

        return ontologyAnnot;
    },

    /**
     *  POST a suggested tranlation pair of videos/annotations to the easytv-annotator API
    */
   postTranslation: async function(vid1, vid2)
   {
       var options = {};
       options.method = 'POST';
       options.uri = "http://api.easytv.linkeddata.es/easytv-annotator/annotateTranslatedVideos",
       options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
       options.body = {video1:vid1, video2:vid2};
       options.json = true;   // Automatically parses the JSON string in the response

       var ontologyAnnot =  await reqProm(options).catch(
         function(err) { sails.log.error('Translations POST errorcode: '+ err.statusCode + " with message:" + err.message)
       });

       return ontologyAnnot;
   },

    /**
     *  POST a remove request for a previously submitted video-annotation to the Ontology
    */
    removeFromGraph: async function(video_url)
    {
      var options = {};
      options.method = 'DELETE';
      options.uri ="http://api.easytv.linkeddata.es/easytv-annotator/deleteGraphFromVideoURL?VideoURL="+ encodeURIComponent(video_url),
      options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
      // options.body = { VideoURL: video_url};
      options.json = true;   // Automatically parses the JSON string in the response
      var errorcode = null;
      var ontologyRemove =  await reqProm(options).catch(
        function(err) { errorcode = err.statusCode; sails.log.error('Translations POST errorcode: '+ err.statusCode + " with message:" + err.message)
      });
       if (errorcode)
          return "error";
        else
          return ontologyRemove;    
      },
    /** 
     * GET the suggested translations for a videoURI and the target-language
    */
   getTranslation: async function(videoURI, targetLang)
   {
       var options = {};
       options.method = 'GET';
       options.uri = "http://api.easytv.linkeddata.es/easytv-annotator/getTranslation?targetLang="+targetLang+"&videoURI="+videoURI,
       options.headers = {'User-Agent' : 'Request-Promise', 'Content-Type' : 'application/json'};
       options.json = true;   // Automatically parses the JSON string in the response
       var errorcode = null;
       var videoTranslation =  await reqProm(options).catch(
         function(err) { errorcode = err.statusCode; sails.log.error('EasyTv-annotator GET errorcode: '+ err.statusCode + " with message:" + err.message)
          });
        
       if (errorcode)
          return "error";
        else
          return videoTranslation;
   },

    /** 
     * post-process the list of annotation comments (incoming from the annotation-app) 
     * into the proper format (proper unpacking the list)
    */
   processAnnotations: async function(postcomments)
   {
    segments = [];
    var counter = 1;
    await postcomments.map( annot => {
        var segment = {};
        segment.order = counter;
        segment.start =  annot.range.start ;
        segment.end = annot.range.end || annot.range.stop;
        segment.content = annot.comments[0];
        if(annot.comments[1])
          segment.content2 = annot.comments[1];
        segments.push(segment);
        counter++;
    });

    return segments;
   }

}
