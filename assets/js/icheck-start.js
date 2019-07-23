$(document).ready(function() {

    $(function () {
        //iCheck for checkbox and radio inputs
        $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
          checkboxClass: 'icheckbox_minimal-blue',
          radioClass   : 'iradio_minimal-blue'
        })
        //Red color scheme for iCheck
        $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
          checkboxClass: 'icheckbox_minimal-red',
          radioClass   : 'iradio_minimal-red'
        })
        //Flat red color scheme for iCheck
        $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
          checkboxClass: 'icheckbox_flat-green',
          radioClass   : 'iradio_flat-green'
        })
    
      })

  
      $("form").submit(function () {

        if(document.getElementById("emailNewJob").checked) {
          document.getElementById('emailNewJobHidden').disabled = true;
        }
        if(document.getElementById("emailRejectJob").checked) {
          document.getElementById('emailRejectJobHidden').disabled = true;
        }
        if(document.getElementById("showOtherJobs").checked) {
          document.getElementById('showOtherJobsHidden').disabled = true;
        }
    })

})

