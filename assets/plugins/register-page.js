
$(document).ready(function () 
{
    var counter = langsLen+1;
    //var selectedLangs = [];

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
            console.log(langs);
            var selectedLangs = [];
            var selectedNames = [];
            var selecRows = $("select.llang");
            console.log(selecRows);
            selecRows.each( function(row){
               selectedLangs.push(selecRows[row].value);
               selectedNames.push(selecRows[row].name);
               $("[name='"+selecRows[row].name+"']").attr("disabled", true);
            })
            console.log(selectedLangs);
            //$(this).closest(".tr_clone").find("select.llang").attr("disabled", true);

            var prevRow = $(this).closest(".tr_clone").clone();
            prevRow.find("select.llang").empty();
            prevRow.find("select.llang").attr('name', "lang"+(counter-1));
            prevRow.find("select.llevel").attr('name', "level"+(counter-1));
            langs.forEach( function(lang){
                if(selectedLangs.indexOf(langsISO[langs.indexOf(lang)])<0)
                    prevRow.find("select.llang").append("<option value='"+langsISO[langs.indexOf(lang)]+"'> "+lang+" </option>")
             })

            prevRow.find("select.llang").attr("disabled", false);

            $("table.lang-list").append(prevRow);

            if(selectedLangs.length==langs.length-1)
                $(this).closest(".tr_clone").find("#addrow").remove();

            prevRow.find("#addrow").remove();
        }
        counter++;
    });

    $("[type='submit']").click(function (e) {
        var selecRows = $("select.llang");
        selecRows.each( function(row){
           $("[name='"+selecRows[row].name+"']").attr("disabled", false);
        })
    });


    $("table.lang-list").on("click", ".ibtnDel", function (event) {
        $(this).closest(".tr_clone").remove();
        counter -= 1
    });

    
    var input = document.querySelector("#phone-number");
    if(input)
        window.intlTelInput(input, {
            onlyCountries: ["es", "gr", "it"],
            separateDialCode: true,
            hiddenInput: "fullNum",
            preferredCountries: [ "es"],
            utilsScript: "../plugins/intl-tel-input/js/utils.js?" // just for formatting/placeholders etc
        });
});

