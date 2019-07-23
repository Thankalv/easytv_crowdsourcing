
Dropzone.autoDiscover = false;

$(document).ready(function() 
{
      videoslist = [];
      taskId = '5cd1692dffc7b2465807f51d';
      var myDropzone = new Dropzone(
        //id of drop zone element 1
        '#myVideoDropzone', {
          url: "/task/uploadvideo",
          paramName: "videofile",
          dictDefaultMessage: "Drag 'n drop or<br>click...",
          maxFilesize: 80,
          parallelUploads: 5,
          // Prevents Dropzone from uploading dropped files immediately
          autoProcessQueue: false,
          
          sending: function(file, xhr, formData) {
            videoslist.push(file.name);
            formData.append("taskId", taskId)
          },  

          init: function() 
          {
            var submitButton = document.querySelector("#submit-videos");
            var videoDropzone = this; // closure
        
            submitButton.addEventListener("click", function() {
               console.log('Processing video upload...');
               // needs to be called because 'autoProcessQueue' is false
               videoDropzone.processQueue();
            });
  
            // You might want to show the submit button only when files are dropped here:
            this.on("addedfile", function(file) {
              console.log(file.name)
               file.previewElement.addEventListener("click", function() {
                videoDropzone.removeFile(file);
               });
            });
    
            this.on("success", function(file, response) {
              console.log('Completed uploading! Filename: '+file.name);
              delete response.info;
              console.log(response);
              videoslist[videoslist.indexOf(file.name)] = response._id;
              console.log(videoslist);
            });

            this.on("error", function(errorResponse) 
            {
              $(errorResponse.previewElement).find('.dz-error-message').text(errorResponse.xhr.response);
              console.log(errorResponse);
              //data = { 'errorName':errorResponse.xhr.response.code , 'description': errorResponse.xhr.response.message };
              $.post("/api/log-error?errorName="+errorResponse.xhr.statusText+'&description='+errorResponse.xhr.response, function(data, status) {
                if(data.code==200)
                  console.log("Error was reported!");
              });

            });
          }
        }
      );

});