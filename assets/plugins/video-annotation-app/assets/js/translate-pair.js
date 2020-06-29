var player;
var player2;
// Setup player and plugin
(function(){

    setTimeout(function() {
        player = videojs('the_video', {
            controlBar: { volumePanel: { inline: false }}
        });
        console.log(sourceAnnotations);
        player.muted(true);
        player.annotationComments({
            annotationsObjects: sourceAnnotations,
            bindArrowKeys: true,
            meta: { user_id: 3, user_name: sourceLang+"-annotation" }
        });
    },300);
    
    setTimeout(function() {
        player2 = videojs('the_video2', {
            controlBar: { volumePanel: { inline: false }}
        });
        console.log(targetAnnotations);
        //player.muted(true);
        player2.annotationComments({
            annotationsObjects: targetAnnotations,
            bindArrowKeys: true,
            meta: { user_id: 3, user_name: targetLang+"-annotation" }
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
            type: 'success',
            title: 'Done!',
            text: 'Thanks for suggesting a translation!',
        });
}

// Intercept VAC logs and port them to console UI
(function(){
    window.VAC_DEBUG = true;
    var showComment = '';

    var $consoleS = $(".sourceConsole"),
        $consoleT = $(".targetConsole"),
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
                    }
                    else{   
                        showComment = "";
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

            if(output.indexOf("annotationClosed")>-1){
                $(".sourceConsole").empty();
               // $user.text(""); //  $date.text(""); //  $comment.text("");
            }
            else if(typeof showComment === 'object'){
                //console.log(sourceLang);
                if( showComment.meta.user_name.indexOf(sourceLang)>-1)
                    $consoleS.append( $("<p/>").text(showComment.meta.user_name+" << "+showComment.body) );
                if( showComment.meta.user_name.indexOf(targetLang)>-1)
                    $consoleT.append( $("<p/>").text(showComment.meta.user_name+" << "+showComment.body) );
              //  $user.text(showComment.meta.user_name); //  $date.text(showComment.meta.datetime); //  $comment.text(showComment.body);
            }
            $consoleS.scrollTop($consoleS[0].scrollHeight)
            $consoleT.scrollTop($consoleT[0].scrollHeight)
        }
        consoleLog.apply(console, arguments);
    };
})();


$(".clear-console-btn").on("click", function() {
    $(".sourceConsole").empty();
});



$("#play-video").on("click", function() 
{
    player.play();
    player2.play();
});

// execute Service-2 of the Ontology-API for suggesting translations
$("#post-translation").on("click", function() {
    if(comments.length==0){
        swalModal("error");
        return;
    }
    var postcomments1 = [];  // annotations in language of video #1
    var postcomments2 = [];  // annotations in language of video #2
    comments.map( annot => {
        console.log(annot);
        var source = true;
        annot.comments = annot.comments.map( comment => {
            if(comment.meta.user_name.indexOf(targetLang)>-1)
                    source = false;
            if(comment.body) return comment.body; 
            else return comment;
        })
        if(source)
            postcomments1.push(annot)
        else
            postcomments2.push(annot)
    });
    postcomments1 = sortByKey(postcomments1, "rangestart");
    postcomments2 = sortByKey(postcomments2, "rangestart");

    var vid1 = $("#the_video_html5_api");
    var vid2 = $("#the_video2_html5_api");
    var data = { 
        "video1":{videoURL:videoURL1, postcomments:postcomments1, lang: lang1, duration: vid1[0].duration, concept:concept1},
        "video2":{videoURL:videoURL2, postcomments:postcomments2, lang: lang2, duration: vid2[0].duration, concept:concept2}
    };

    console.log(data);

     $.ajax({
         url: "/video-annotation/submit-pair",
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

