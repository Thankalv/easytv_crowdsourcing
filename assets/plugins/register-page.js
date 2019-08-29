
$(document).ready(function () 
{
    var counter = langsLen+1;

    $("#addrow").on("click", function () {
        //var newRow = $("<tr>");
        //var cols = "";
        //cols += '<td><input type="text" class="form-control" name="lang' + counter + '"/></td>';
        //cols += '<td><input type="text" class="form-control" name="level' + counter + '"/></td>';
        //cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
        //newRow.append(cols);
        if( counter == langsLen+1){
            $("#langselect").attr('name' , "lang"+(counter-1));
            $("#levelselect").attr('name' , "level"+(counter-1));
            $("#langselect").css("display", "block");
            $("#levelselect").css("display", "block");
        }
        else{
            var prevRow = $(this).closest(".tr_clone").clone();
            prevRow.find("select.llang").attr('name' , "lang"+(counter-1));
            prevRow.find("select.llevel").attr('name' , "level"+(counter-1));
            $("table.lang-list").append(prevRow);
            prevRow.find("#addrow").remove();            
        }
        counter++;
    });


    $("table.lang-list").on("click", ".ibtnDel", function (event) {
        $(this).closest(".tr_clone").remove();
        counter -= 1
    });

    // On-the-fly mask change
    // $('#phone-number').mask('00000-000', options);
    
    var input = document.querySelector("#phone-number");
    window.intlTelInput(input, {
        onlyCountries: ["es", "gr", "it"],
        separateDialCode: true,
        hiddenInput: "fullNum",
        preferredCountries: [ "es"],
        utilsScript: "../plugins/intl-tel-input/js/utils.js?" // just for formatting/placeholders etc
      });


});

