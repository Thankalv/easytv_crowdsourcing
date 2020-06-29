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

  $('#confidentiality').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });

  $('#deleteProfileMessage').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });

  $('#en1').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });

  $('#en2').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });

  $('#en25').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });

  $('#en3').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });
  $('#en4').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });
  $('#en5').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });
  $('#en6').summernote({
    placeholder: "provide organisation's details related to the platform",
    tabsize: 2,
    height: 80,
    popover: {
      image: [],
      link: [],
      air: []
    }
  });
  $('#en7').summernote({
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


  var editables = document.getElementsByClassName("note-editable")
  if(editables[2]) editables[2].style.background = "rgba(255, 144, 7, 0.58)"
  if(editables[3]) editables[3].style.background = "rgba(80, 162, 175, 0.3)"
  if(editables[4]) editables[4].style.background = "rgba(80, 162, 175, 0.3)"
  if(editables[5]) editables[5].style.background = "rgba(80, 162, 175, 0.3)"
  if(editables[6]) editables[6].style.background = "rgba(80, 162, 175, 0.3)"
  if(editables[7]) editables[7].style.background = "rgba(80, 162, 175, 0.3)"
  if(editables[8]) editables[8].style.background = "rgba(80, 162, 175, 0.3)"
  if(editables[9]) editables[9].style.background = "rgba(80, 162, 175, 0.3)"
  if(editables[10]) editables[10].style.background = "rgba(80, 162, 175, 0.3)"
});
