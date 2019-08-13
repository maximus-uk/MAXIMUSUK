var slideImageArray = [];
var slideLinkArray = [];
var slideNameArray = [];

function getSlideData(siteURL) {

    // ***** Setup local variables
    var slidePos = [];
    var inc = 0;
    var today = new Date();
    var dd = today.getDay();
    var mm = today.getMonth() + 1; //January is 0
    var yyyy = today.getFullYear();
    
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    var dateToday = dd + '/' + mm + '/' + yyyy;

    // ***** Setup SPServices Variables
    var list = "Slides";
    var fields = "<ViewFields>" +
        "<FieldRef Name='slideID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='NewsHeadline' />" +
        "<FieldRef Name='NewsImage' />" +
        "<FieldRef Name='newsURL' />" +
        "<FieldRef Name='startDate' />" +
        "<FieldRed Name='DaysLive' />" +
        "<FieldRef Name='endDate' />" +
        "</ViewFields>";   

    // ***** Get slides from list
    $().SPServices({
        operation: "GetListItems",
        async: false,
        webURL: siteURL,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var slideID = $(this).attr("ows_slideID");
                var slideTitle = $(this).attr("ows_Title");
                var slideHeadline = $(this).attr("ows_NewsHeadline");
                var slideLink = $(this).attr("ows_newsURL");
                var slideImage = $(this).attr("ows_NewsImage").split(",")[0];
                var slideName = $(this).attr("ows_NewsImage").split(",")[1];                                
                var endDate = $(this).attr("ows_endDate");
                var slideEndDate = endDate.split(';#')[1];
                var endYYYY = slideEndDate.substr(0, 4);
                var endMM = slideEndDate.substr(5, 2);
                var endDD = slideEndDate.substr(8, 2);

                slideEndDate = endDD + '/' + endMM + '/' + endYYYY;

                // check the slide is still in date
                if (dateToday <= slideEndDate) {
                    
                    // add boolean true flag at slide ID position
                    slidePos[slideID] = true;

                    if (slideLink === undefined) {
                        slideLink = siteURL;
                    } else {
                        slideLink = slideLink.split(",")[0];
                    }

                    if(slideID==='1'){
                        $('#slideItems').append('<div class="carousel-item active">' +
                                                '<a href="'+slideLink+'">' +
                                                '<img src="'+slideImage+'" alt="'+slideName+'">' +
                                                '<div class="carousel-caption">' +
                                                    '<h4 class="display-4 text-white font-weight-bolder">'+slideTitle+'</h4>' +
                                                    '<span>'+slideHeadline+'</span>' +
                                                '</div>' +
                                                '</a>' +                                        
                                                '</div>');
                        $('#indicators').append('<li data-target="#slideshowApp" data-slide-to="0" class="active"></li>');
                    }

                    if(slideID>'1'){
                        $('#slideItems').append('<div class="carousel-item">' +
                                                '<a href="'+slideLink+'">' +
                                                '<img src="'+slideImage+'" alt="'+slideName+'">' +
                                                '<div class="carousel-caption">' +
                                                    '<h4 class="display-4 text-white font-weight-bolder">'+slideTitle+'</h4>' +
                                                    '<span>'+slideHeadline+'</span>' +
                                                '</div>' +
                                                '</a>' +                                        
                                                '</div>');
                        $('#indicators').append('<li data-target="#slideshowApp" data-slide-to="'+inc+'"></li>');
                    }
                    inc++;
                }
            });
        }
    });

    for (var i = 1; i < 7; i++) {
        if (slidePos[i] !== true) {
            //getTempSlides(i); 
        } 
    }
}

function getTempSlides(slideID) {

    var list = "TempSlides";
    var fields = "<ViewFields>" +
        "<FieldRef Name='slideID' />" +
        "<FieldRef Name='LinkTitle' />" +
        "<FieldRef Name='NewsHeadline' />" +
        "<FieldRef Name='newsURL' />" + 
        "<FieldRef Name='NewsImage' />" +      
        "</ViewFields>";

    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var tempID = $(this).attr("ows_slideID");
                var tempTitle = $(this).attr("ows_LinkTitle");
                var tempHeadline = $(this).attr("ows_NewsHeadline");
                var tempLink = ($(this).attr("ows_newsURL"));
                var tempImage = $(this).attr("ows_NewsImage").split(",")[0];
                var tempName = $(this).attr("ows_NewsImage").split(",")[1];                                
                
                if(tempID === slideID){
                    $('#slideItems').append('<div class="carousel-item">' +
                    '<a href="'+tempLink+'">' +
                    '<img src="'+tempImage+'" alt="'+tempName+'">' +
                    '<div class="carousel-caption">' +
                        '<h4 class="display-4 text-white font-weight-bolder">'+tempTitle+'</h4>' +
                        '<p>'+tempHeadline+'</p>' +
                    '</div>' +
                    '</a>' +                                        
                    '</div>');
                    $('#indicators').append('<li data-target="#slideshowApp" data-slide-to="'+slideID+'"></li>');
                }
            });
        }
    });
}