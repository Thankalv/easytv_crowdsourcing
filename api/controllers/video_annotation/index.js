module.exports = {

    friendlyName: 'List of videos for annotation, table by language',
    
    exits: {
  
      success: {
        statusCode: 200,
        description: 'show lists of the available videos',
        viewTemplatePath: 'video-annotation/index'
      },
  
    },
  
    fn: async function () 
    {
        // en0 = {url:"http://nlp-easytv.oeg-upm.net/video/en/8.mp4", id:8};
        // en1 = {url:"http://nlp-easytv.oeg-upm.net/video/en/9.mp4", id:9};
        // es0 = {url:"http://nlp-easytv.oeg-upm.net/video/es/8.mp4", id:8};
        // es1 = {url:"http://nlp-easytv.oeg-upm.net/video/es/9.mp4", id:9};
        
        var esVideos = await VideoAnnotated.find({lang:"es"}).limit(3);
        var itVideos = await VideoAnnotated.find({lang:"it"}).limit(3);

        var slvideos = { es:esVideos, 
                         it:itVideos,
                         en:[] };
        
        return {slvideos:slvideos};
    }
  
  };
  