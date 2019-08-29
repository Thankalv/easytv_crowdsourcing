$(function() {
    const Toast = Swal.mixin({
      toast: true,
      //position: 'top-end',
      //showConfirmButton: false,
      timer: 3000
    });

    $('.swalDefaultInfo').click(function() {
      Toast.fire({
        type: 'info',
        title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });
    $('.swalDefaultError').click(function() {
      Toast.fire({
        type: 'error',
        title: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.'
      })
    });

  });