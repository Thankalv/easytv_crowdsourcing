
$(document).ready(function() 
{
      Dropzone.autoDiscover = false;
      //* include some event-based function for handling extra parameters during the preparation 
      //* of the uploading resources
      var firstDropzone = new Dropzone(
        //id of drop zone element 1
        '#my-dropzone-1', {
          paramName: "videofile",
          dictDefaultMessage: "<i class='fa fa-upload'></i> Drag 'n drop or<br>click...",
          maxFilesize: 100,
          parallelUploads: 5,
          // Prevents Dropzone from uploading dropped files immediately
          autoProcessQueue: false,
          sending: function(file, xhr, formData) {
            // videoslist.push(file.name);
            if(clang)
              formData.append("lang", clang);
            else
              formData.append("lang", $("#clang").val());
            if(taskId)
              formData.append("taskId", taskId);
            formData.append("nle", $("#concept").val());
          },  
          init: function() {
            var submitButton = document.querySelector("#submit-videos");
            var videoDropzone = this; // closure
            submitButton.addEventListener("click", function() 
            {
              if($("#clang").val()=="" || $("#concept").val()==""){
                  console.log("Please choose a language and define a concept");
                  return;
              }
               console.log('Processing video upload...');
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
            this.on("success", function(file, response) 
            {
              console.log(response);
              var bb = document.getElementById("next-annotate");
              bb.href = bb.href + response.taskId;
              bb.style.display = "block";
              console.log('Completed uploading! Filename: '+file.name);
            });
          }
        }
      );
  });