$(document).ready(function() {

  /*
  $('.wysihtml5-textarea').wysihtml5();

  toolbar: {
    "font-styles": false,
    "emphasis": true,
    "lists": true,
    "html": false,
    "link": false,
    "image": false,
    "color": false,
    "blockquote": false,
  }
  // dynamic load wysihtml5 css
  var ls = document.createElement("link");
  ls.rel = "stylesheet";
  ls.href = "/js/local/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css";
  document.getElementsByTagName("head")[0].appendChild(ls);
  */


  $('#description').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });

  $('#feedback').summernote({
    placeholder: 'write your comment',
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });

});
