(function() {
    commentsId = [];
    comments = [];
    sourceAnnotations = [];
    targetAnnotations = [];

    // REFACTOR: initialization of previous annotation's segments can be done (and should) in the back-end controller
    //console.log(sourceLang);
    //console.log(targetLang);
    //console.log(vidsegments2);
    var runTo = vidsegments.length;
    if(vidsegments2)
        if(vidsegments2.length>runTo)
            runTo=vidsegments2.length;

    for (var i=0; i <runTo; i++)
    {
        if(i<= vidsegments.length){
            segment = {};
            segment.id = vidsegments[i].order;
            segment.shape = null;
            segment.range = {};
            segment.range.start = vidsegments[i].start;
            segment.range.end = vidsegments[i].end;
            segment.comments = [];
            segment.comments.push( {id:1, meta:{user_name: sourceLang+"-annotation"}, body: vidsegments[i].content});
            if(vidsegments[i].content2)
                segment.comments.push({id:2, meta:{user_name: sourceLang+"-annotation"}, body: vidsegments[i].content2});
            sourceAnnotations.push(segment);
        }

        if(vidsegments2)
            if( i < vidsegments2.length){
                segment = {};
                segment.id = vidsegments2[i].order;
                segment.shape = null;
                segment.range = {};
                segment.range.start = vidsegments2[i].start;
                segment.range.end = vidsegments2[i].end;
                segment.comments = [];
                segment.comments.push( {id:1, meta:{user_name: targetLang+"-annotation"}, body: vidsegments2[i].content});
                if(vidsegments2[i].content2)
                    segment.comments.push({id:2, meta:{user_name: targetLang+"-annotation"}, body: vidsegments2[i].content2});
                targetAnnotations.push(segment);
            }
    }


})();
