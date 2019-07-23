
/**
 * /api/services/AnnotService.js
 *
 * Video-annotation related services
 */

var _ = require('lodash');
var reqProm = require('request-promise');
var moment = require("moment");

module.exports = {


    /* 
      POST the submission to the easytv-annotator API
    */
    annotateVideo : async function(annotations)
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

}
