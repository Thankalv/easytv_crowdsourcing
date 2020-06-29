

(function() {
        commentsId = [];
        comments = [];
        sourceAnnotations = [];
        // REFACTOR: initialization of previous annotation's segments can be done (and should) in the back-end controller
        var runTo = vidsegments.length;

        for (var i=0; i < runTo; i++){
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
        }


})();
