// Setup player and plugin
(function(){
    var player = videojs('the_video', {
        controlBar: {
            volumePanel: { inline: false }
        }
    });
    player.muted(true);
    player.annotationComments({
        annotationsObjects: demoAnnotations,
        bindArrowKeys: true,
        meta: {
            user_id: 3,
            user_name: "Guest"
        }
    });
})();

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// Intercept VAC logs and port them to console UI
(function(){
    window.VAC_DEBUG = true;
    var showComment = '';
    var $console = $(".console"),
        consoleLog = console.log;
    //var $user = $('#comment-username');
    //var $date = $('#comment-date');
    //var $comment = $('#comment-content');

    console.log = function (msg) 
    {
        if (msg === "::VAC::") 
        {
            var output = "";
            for(var i = 0; i <= arguments.length; i++) 
            {
                //if(String(JSON.stringify(arguments[i])).indexOf("annotation")>-1)
                //    nextEvents.push(arguments[i]);
                if (Array.isArray(arguments[i]))
                {
                    for (var j=0; j <= arguments[i].length; j++)
                        if( arguments[i][j] != undefined && commentsId.indexOf(arguments[i][j].id)<0)
                        {   
                            arguments[i][j]['rangestart'] = arguments[i][j].range.start; 
                            comments.push(arguments[i][j]);
                            commentsId.push(arguments[i][j].id)
                        }
                   comments =  sortByKey(comments, 'rangestart');
                }
                if (typeof arguments[i] === 'object')
                    if (arguments[i].annotation != undefined)
                        showComment = arguments[i].annotation.comments[0];
                    else
                        showComment = "";
                output = output + " " + JSON.stringify(arguments[i]);
            };

            // Remove extra quotes and any undefined
            output = output.replace(/\"/g, "").trim();
            output = output.replace("undefined", "");
            output = ">> " + output;

            var $p = $("<p/>").text(output);
            //$console.append($p);
            if(output.indexOf("annotationClosed")>-1){
               // $user.text("");
              //  $date.text("");
              //  $comment.text("");
            }
            else if(typeof showComment === 'object'){
                $console.append( $("<p/>").text("Username: "+showComment.meta.user_name+" said: "+showComment.body) );
              //  $user.text(showComment.meta.user_name);
              //  $date.text(showComment.meta.datetime);
              //  $comment.text(showComment.body);
            }
            $console.scrollTop($console[0].scrollHeight)
        }
        consoleLog.apply(console, arguments);
    };
})();


$(".clear-console-btn").on("click", function() {
    $(".console").empty();
});


$("#post-notifications").on("click", function() {

    if(comments.length==0)
        $( "#alertbox" ).html( '<div class="alert alert-warning alert-dismissible MyFlashBox centerButton" style="width:40%">\
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>\
        No new annotation was found</div>' );

    //console.log(comments);
    demoAnnotations.map( annot => { 
            annot.comments = annot.comments.map( comment => {delete comment.commentList; return comment.body})
            comments.push(annot)
        });

    var postcomments = sortByKey(comments, "rangestart");
    var data = {'postcomments': postcomments};
    console.log(data);

    $.ajax({
        url: "/video-annotation/submit",
        type: 'POST',
        data: JSON.stringify(data),
        contentType:"application/json",
        dataType: 'json',
        success: function (data) {
            console.info(data);
        }
    });

    // an example JSON input from  "oeg-upm.net"
    var video = {
        "url": "http://nlp-easytv.oeg-upm.net/video/en/5.mp4",
        "nls": "Climate",
        "sls": "Climate" ,
        "duration": "00:03" ,
        "language": "en" ,
         "segments": [{
                 "order": "1",
                "start": "00:00",
                "end" : "00:03",
                "content" : "Climate"
         }
         ]
      }

});
