(function() {
    commentsId = [];
    comments = [];
    demoAnnotations = [

    ];

    // REFACTOR: initialization of previous annotation's segments can be done (and should) in the back-end controller
    console.log(vidsegments);
    for (var i=0; i <= vidsegments.length; i++)
    {
        segment = {};
        segment.id = vidsegments[i].order;
        segment.shape = null;
        segment.range = {};
        segment.range.start = vidsegments[i].start;
        segment.range.end = vidsegments[i].end;
        segment.comments = [];
        segment.comments.push( {id:1, meta:{user_name: "prev-annotation"}, body: vidsegments[i].content});
        if(vidsegments[i].content2)
            segment.comments.push({id:2, meta:{user_name: "prev-annotation"}, body: vidsegments[i].content2});
        demoAnnotations.push(segment);
    }

})();
