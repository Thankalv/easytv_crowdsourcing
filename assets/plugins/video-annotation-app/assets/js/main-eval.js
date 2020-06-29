// Setup player and plugin
(function(){

    setTimeout(function() {
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
                user_name: username
            }
        });
    },300);

})();

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function swalModal(modaltype) {
    if(modaltype=="error")
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No new annotation was submitted!'
        });
    else if(modaltype=="success")
        Swal.fire({
            //position: 'top-end',
            type: 'success',
            title: 'Done!',
            text: 'Thanks for submitting!',
        });
}

// Intercept VAC logs and display them as video-subtitles
(function(){
    window.VAC_DEBUG = true;
    var showComment = '';
    var showCommentNL = '';
    var $console = $(".console"),
        $consoleNL = $(".consoleNL"),
        consoleLog = console.log;

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
                    {
                        if( arguments[i][j] != undefined && commentsId.indexOf(arguments[i][j].id)<0){   
                            arguments[i][j]['rangestart'] = arguments[i][j].range.start; 
                            comments.push(arguments[i][j]);
                            commentsId.push(arguments[i][j].id);
                        }
                        if( arguments[i][j] != undefined && commentsId.indexOf(arguments[i][j].id)>-1 ){
                            var cindex = commentsId.indexOf(arguments[i][j].id)
                            if(arguments[i][j].comments.length==2)
                                comments[cindex].comments = arguments[i][j].comments;
                        }
                    }
                    //comments =  sortByKey(comments, 'rangestart');
                }
                if (typeof arguments[i] === 'object')
                    if (arguments[i].annotation != undefined)
                        if (arguments[i].annotation.comments.length == 2)
                            $( ".vac-reply-btn" ).remove();

                if (typeof arguments[i] === 'object')
                    if (arguments[i].annotation != undefined){
                        showComment = arguments[i].annotation.comments[0];
                        showCommentNL = "";
                        if (arguments[i].annotation.comments[1] != undefined)
                            showCommentNL = arguments[i].annotation.comments[1];
                    }
                    else{   
                        showComment = "";
                        showCommentNL = "";
                    }
                output = output + " " + JSON.stringify(arguments[i]);

                if(output.indexOf("annotationDeleted")>-1)
                    if (typeof arguments[i] === 'object')
                        if (arguments[i].id != undefined)
                        {
                            var deleteID = commentsId.indexOf(arguments[i].id);
                            commentsId.splice(deleteID, 1);
                            comments.splice(deleteID, 1);
                        }
            };

            comments =  sortByKey(comments, 'rangestart');
            // Remove extra quotes and any undefined
            output = output.replace(/\"/g, "").trim();
            output = output.replace("undefined", "");
            output = ">> " + output;

            var $p = $("<p/>").text(output);
            //$console.append($p);
            if(output.indexOf("annotationClosed")>-1){
                $(".console").empty();
                $(".consoleNL").empty();
               // $user.text(""); //  $date.text(""); //  $comment.text("");
            }
            else if(typeof showComment === 'object'){
                $console.append( $("<p/>").text(showComment.meta.user_name+" << said: "+showComment.body) );
                if(typeof showCommentNL === 'object')
                    $consoleNL.append( $("<p/>").text(showCommentNL.meta.user_name+" << said: "+showCommentNL.body) );
              //  $user.text(showComment.meta.user_name); //  $date.text(showComment.meta.datetime); //  $comment.text(showComment.body);
            }
            $console.scrollTop($console[0].scrollHeight)
            $consoleNL.scrollTop($console[0].scrollHeight)
        }
        consoleLog.apply(console, arguments);
    };
})();

$(".clear-console-btn").on("click", function() {
    $(".console").empty();
});

$("#post-notifications").on("click", function() {
    if(comments.length==0){
        swalModal("error");
        return;
    }
    var vid = $("#the_video_html5_api");
    var postcomments = [];
    comments.map( annot => {
            annot.comments = annot.comments.map( comment => { 
                if(comment.body) return comment.body; 
                else return comment;
            })
            postcomments.push(annot)
    });

    postcomments = sortByKey(postcomments, "rangestart");
    var data = {'id':video_id, 'videoURL': videoURL, 'postcomments': postcomments, 'duration': vid[0].duration};
    console.log(data);
    $.ajax({
        url: "/video-annotation/submit",
        type: 'POST',
        data: JSON.stringify(data),
        contentType:"application/json",
        dataType: 'json',
        success: function (data) {
            console.info(data);
            swalModal("success");
            var pn = document.getElementById("post-notifications");
            pn.style.display = 'none!important';
            var bb = document.getElementById("next-mocap");
            bb.style.display = "block";
        }
    });

});

// submit a score for this submission
$("#post-evaluation").on("click", function() 
{
    // get the bar's score
    console.log(videoURL);
    var verifyScore = document.getElementById("range_6").value;
    var data = {'id':video_id, "vscore": parseInt(verifyScore)};
    $.ajax({
        url: "/video-annotation/verify-submission",
        type: 'POST',
        data: JSON.stringify(data),
        contentType:"application/json",
        dataType: 'json',
        success: function (data) {
            console.info(data);
            swalModal("success");
            setTimeout(function() { location.reload() }, 500)
        }
    });
});

// completely remove
$("#post-rejection").on("click", function() 
{
    // get the bar's score
    console.log(videoURL);
    var verifyScore = document.getElementById("range_6").value;
    var data = {'id':video_id, "score": parseInt(verifyScore)};
    $.ajax({
        url: "/video-annotation/reject-submission",
        type: 'POST',
        data: JSON.stringify(data),
        contentType:"application/json",
        dataType: 'json',
        success: function (data) {
            console.info(data);
            swalModal("success");
            setTimeout(function() { location.reload() }, 500)
        }
    });
});