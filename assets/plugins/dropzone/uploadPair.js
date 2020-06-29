
$(document).ready(function() 
{
      Dropzone.autoDiscover = false;
      /*  include some event-based function for handling extra parameters during the preparation 
      /*  of the uploading resources */
      new Dropzone(
        //id of drop zone element 1
        '#my-dropzone-1', {
          paramName: "videofile",
          dictDefaultMessage: "Drag 'n drop<br> video #1",
          maxFilesize: 80,
          parallelUploads: 5,
          // Prevents Dropzone from uploading dropped files immediately
          autoProcessQueue: false,
          sending: function(file, xhr, formData) {
            //videoslist.push(file.name);
            formData.append("transl-task", translationTask);
            formData.append("vid", "1");
          },  
          init: function() {
            var submitButton = document.querySelector("#submit-video1");
            var videoDropzone = this; // closure
            submitButton.addEventListener("click", function() {
               console.log('Uploading your translation video...');
               // needs to be called because 'autoProcessQueue' is false
               videoDropzone.processQueue();
            });
            // You might want to show the submit button only when 
            // files are dropped here:
            this.on("addedfile", function(file) {
               file.previewElement.addEventListener("click", function() {
                videoDropzone.removeFile(file);
               });
            });
            this.on("success", function(file, response) {
              if(response.ready=="YES"){
                var bb = document.getElementById("pair-annotate");
                bb.style.display = "block";
              }
              console.log(response);
              // setTimeout(function() { location.reload();  }, 200);
            });
          }
        }
      );
      new Dropzone(
        //id of drop zone element 1
        '#my-dropzone-2', {
          paramName: "videofile",
          dictDefaultMessage: "Drag 'n drop<br> video #2",
          maxFilesize: 80,
          parallelUploads: 5,
          // Prevents Dropzone from uploading dropped files immediately
          autoProcessQueue: false,
          sending: function(file, xhr, formData) {
            //videoslist.push(file.name);
            formData.append("transl-task", translationTask);
            formData.append("vid", "2");
          },  
          init: function() {
            var submitButton = document.querySelector("#submit-video2");
            var videoDropzone = this; // closure
            submitButton.addEventListener("click", function() {
               console.log('Uploading your translation video...');
               videoDropzone.processQueue();
            });
            // You might want to show the submit button only when 
            // files are dropped here:
            this.on("addedfile", function(file) {
               file.previewElement.addEventListener("click", function() {
                videoDropzone.removeFile(file);
               });
            });
            this.on("success", function(file, response) {
              if(response.ready=="YES"){
                var bb = document.getElementById("pair-annotate");
                bb.style.display = "block";
              }
              console.log(response);
              // setTimeout(function() { location.reload();  }, 200);
            });
          }
        }
      );
  });