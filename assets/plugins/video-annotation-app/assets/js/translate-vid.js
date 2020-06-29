var player;

// Setup player and plugin
(function(){

    setTimeout(function() {
        player = videojs('the_video', {
            controlBar: {
                volumePanel: { inline: false }
            }
        });
        console.log(sourceAnnotations);
        player.muted(true);
        player.annotationComments({
            annotationsObjects: sourceAnnotations,
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
              //  $user.text(showComment.meta.user_name); //  $date.text(showComment.meta.datetime); //  $comment.text(showComment.body);
            }
            $consoleS.scrollTop($consoleS[0].scrollHeight)

        }
        consoleLog.apply(console, arguments);
    };
})();


$(".clear-console-btn").on("click", function() {
    $(".sourceConsole").empty();
});


function vacRemove() {
    $(".vac-controls").remove();
};


window.onload = function(){
     setTimeout(function() { vacRemove(); },500); 
    }


// execute Service-2 of the Ontology-API for suggesting translations
$("#post-translation").on("click", function() 
{
    // get the bar's score
    var verifyScore = document.getElementById("range_6").value;
    var data = {'vid1':vid1, 'vid2':vid2, "score": parseInt(verifyScore)};
    $.ajax({
        url: "/video-annotation/verify-translation",
        type: 'POST',
        data: JSON.stringify(data),
        contentType:"application/json",
        dataType: 'json',
        success: function (data) {
            console.info(data);
            swalModal("success");
        }
    });

});
