$(function () {
      /* ION SLIDER */

      $('#range_6').ionRangeSlider({
        min     : 0,
        max     : 100,
        from    : 50,
        type    : 'single',
        step    : 1,
        postfix   : ' accuracy',
        prettify: false,
        hasGrid : true
      })
  
      $('#range_4').ionRangeSlider({
        type      : 'single',
        step      : 1,
        postfix   : ' light years',
        from      : 55000,
        hideMinMax: true,
        hideFromTo: false
      })

    })