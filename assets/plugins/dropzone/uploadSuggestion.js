
$(document).ready(function() 
{
      const Toast = Swal.mixin({
        toast: true,
        //position: 'top-end',
        //showConfirmButton: false,
        timer: 3000
      });

      $('.swalDefaultError').click(function() {
        Toast.fire({
          type: 'error',
          title: 'You did not provide the concept in natural language.'
        })
      });

      Dropzone.autoDiscover = false;
      /*  include some event-based function for handling extra parameters during the preparation 
       *  of the uploading resources
      */
      var firstDropzone = new Dropzone(
        //id of drop zone element 1
        '#my-dropzone-1', {
          paramName: "videofile",
          dictDefaultMessage: "Drag 'n drop or<br>click...",
          maxFilesize: 80,
          parallelUploads: 5,
          // Prevents Dropzone from uploading dropped files immediately
          autoProcessQueue: false,
          
          sending: function(file, xhr, formData) {
            //videoslist.push(file.name);
            formData.append("sourceId", video_id1);
            formData.append("concept", $("#concept").val());
          },  

          init: function() {
            var submitButton = document.querySelector("#submit-videos");
            var videoDropzone = this; // closure
        
            submitButton.addEventListener("click", function() 
            {
              if($("#concept").val()==""){
                Toast.fire({
                  type: 'error',
                  position: 'center-end',
                  title: 'You did not provide the concept in natural language.'
                })                
                return;
              }
               console.log('Uploading your translation video...');
               // needs to be called because 'autoProcessQueue' is false
               videoDropzone.processQueue();
            });
  
            // You might want to show the submit button only when 
            // files are dropped here:
            this.on("addedfile", function(file) 
            {
               file.previewElement.addEventListener("click", function() {
                videoDropzone.removeFile(file);
               });
            });
            this.on("success", function(file, response) 
            {
              //var bb = document.getElementById("next-annotate");
              //bb.style.display = "block";
              console.log(response);
              setTimeout(function() { location.reload();  }, 200);
            });
          }
        }
      );
  });