$(document).ready(function() 
{
    Dropzone.autoDiscover = false;
    /* 
     * include some event-based function for handling extra parameters during the preparation 
    * of the uploading resources
    */
    var firstDropzone = new Dropzone(
      //id of drop zone element 1
      '#my-dropzone-1', {
        paramName: "mocapfile",
        dictDefaultMessage: "<i class='fa fa-upload'></i> Drag 'n drop or<br>click...",
        maxFilesize: 100,
        parallelUploads: 5,
        // Prevents Dropzone from uploading dropped files immediately
        autoProcessQueue: false,
        
        sending: function(file, xhr, formData) {
          // videoslist.push(file.name);
          formData.append("taskId", taskId)
        },  
        init: function() {
          var submitButton = document.querySelector("#submit-mocap");
          var videoDropzone = this; // closure
      
          submitButton.addEventListener("click", function() {
              console.log('Processing video upload...');
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
            if(response.existing=="yes"){
              Swal.fire({
                  type: 'error',
                  title: 'Sorry...',
                  html: 'But this MoCAP file has <b>already been uploaded</b>, <br>' +
                        '<a href="/video-annotation/mocap-new?id='+taskId+'">please try again</a> or <br>'+ 
                        '<a href="/video-annotation/show-mocap?id='+response.existingAnnot+'">have a look at the submission!</a>'
                });
                  return;
              }
              console.log(response);
              var bb = document.getElementById("show-avatar");
              bb.href = bb.href + response.taskId;
              bb.style.display = "block";

              console.log('Completed uploading! Filename: '+file.name);
          });
        }
      }
    );
});