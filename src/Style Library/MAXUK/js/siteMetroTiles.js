'use strict';

function getTiles(URL) {
    
    var method = "GetListItems";
    var list = "metrotiles";
    var count = 1;
    var rowNum = 1;
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Description' />" +
        "<FieldRef Name='LinkURL' />" +
        "<FieldRef Name='ImageURL' />" +
        "<FieldRef Name='LaunchBehavior' />" +
        "</ViewFields>";
    var query = "<Query><OrderBy><FieldRef Name='TileOrder' Ascending='TRUE'/></OrderBy></Query>";
    var buName = URL.split('/')[4];

    $('#metrotiles').append('<div class="row" id="row' + rowNum + '"></div>');

    $().SPServices({
        operation: method,
        async: false,
        webURL: URL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                                             
                var tileTitle = $(this).attr("ows_Title");
                var tileDesc = $(this).attr("ows_Description");
                var tileLink = $(this).attr("ows_LinkURL").split(',')[0];
                var tileImage = $(this).attr("ows_ImageURL").split(',')[0];
                var tileTarget = $(this).attr("ows_LaunchBehavior");
                
                console.log(tileTitle+" "+tileTarget);

                if (tileDesc === undefined) { tileDesc = "" };

                $('#row' + rowNum).append('<a href="' + tileLink + '" target="' + tileTarget + '" class="metrotile text-decoration-none text-center">' +
                    '<img class="img-responsive rounded" src="' + tileImage + '">' +
                    '<h5 class="font-weight-bolder text-decoration-none text-uppercase text-white text-center">' + tileTitle + '</h5>' +
                    '<div class="overlay">' +                   
                    '<p class="info text-decoration-none text-white font-weight-normal rounded">' + tileDesc + '</p>' +
                    '</div>' +
                    '</a>');
                if (count % 3 === 0) {
                    rowNum++;
                    $('#metrotiles').append('<div class="row" id="row' + rowNum + '"></div>');
                }
                count++;
            });
        }
    });
}

function getTeamTiles(appURL) {
    
    var method = "GetListItems";
    var list = "metrotiles";
    var count = 1;
    var rowNum = 1;
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='TileOrder' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Description' />" +
        "<FieldRef Name='LinkURL' />" +
        "<FieldRef Name='ImageURL' />" +
        "<FieldRef Name='LaunchBehavior' />" +
        "</ViewFields>";
    var query = "<Query><OrderBy><FieldRef Name='TileOrder' Ascending='TRUE'/></OrderBy></Query>";
    //var appURL="https://"+URL.split('/')[2]+"/"

    $('#metrotiles').append('<div class="row" id="row' + rowNum + '"></div>');
    
    $().SPServices({
        operation: method,
        async: false,
        webURL: appURL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                                             
                var tileTitle = $(this).attr("ows_Title");
                var tileDesc = $(this).attr("ows_Description");
                var tileLink = $(this).attr("ows_LinkURL").split(',')[0];
                var tileImage = $(this).attr("ows_ImageURL").split(',')[0];
                var tileTarget = $(this).attr("ows_LaunchBehavior");
                
                if (tileDesc === undefined) { tileDesc = "" };

                $('#row' + rowNum).append('<a href="' + tileLink + '" target="' + tileTarget + '" class="metrotile text-decoration-none text-center">' +
                //$('#row' + rowNum).append('<a href="#" onclick="loadPage(\''+tileTitle+'.html\'); return false;" class="metrotile text-decoration-none text-center">' +
                    '<img class="img-responsive rounded" src="' + tileImage + '">' +
                    '<h5 class="font-weight-bolder text-decoration-none text-uppercase text-white text-center">' + tileTitle + '</h5>' +
                    '<div class="overlay">' +
                    '<p class="info text-decoration-none text-white font-weight-normal rounded">' + tileDesc + '</p>' +
                    '</div>' +
                    '</a>');
                if (count % 3 === 0) {
                    rowNum++;
                    $('#metrotiles').append('<div class="row" id="row' + rowNum + '"></div>');
                }
                count++;
            });
        }
    });
}

function loadPage(pageName){
    console.log(siteURL+"/sitepages/"+pageName);
    $('#appContentFrame').attr('src',"/sites/chda/it/sitepages/"+pageName);
}