$(function () {

  'use strict'

  function swalModal(modaltype) {
    if(modaltype=="error")
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'LIMITED ACCESS: you are still blocked!'
        });
    else if(modaltype=="success")
        Swal.fire({
            //position: 'top-end',
            type: 'success',
            title: 'Done!',
            text: 'Thanks for submitting!',
        });
  }

  //console.log(subz);

  // Show warning on page-load
  if(isBlocked)
    swalModal("error");
})