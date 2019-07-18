function getLogo(teamName) {

    // Setup Local Variables
    var count = 0;
    var homeColour = '';
    var homePath = '';

    var url = _spPageContextInfo.webAbsoluteUrl;
    teamName = teamName.toUpperCase();

    if (teamName === 'HOME') {
        var siteURL = url; //.split(".chda.maxuk.co.uk/")[0];
    } else {
        var siteURL = url.split(".chda.maxuk.co.uk/")[0] + ".chda.maxuk.co.uk/";
    };

    //alert(url);

    //Setup SP Services Variables
    var method = "GetListItems";
    var list = "SiteLogo";
    var fields = "<ViewFields>" +
        "<FieldRef Name='Code' />" +
        "<FieldRef Name='bgColour' />" +
        "<FieldRef Name='Site' />" +
        "</ViewFields>";
    //var query = "<Query><Where><Eq><FieldRef Name='Site'/><Value Type='Text'>" + teamMeta + "</Value></Eq></Where></Query>";	

    $().SPServices({
        operation: method,
        async: false,
        webURL: "https://intranet.chda.maxuk.co.uk/",
        listName: list,
        CAMLViewFields: fields,
        //CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var Site = ($(this).attr("ows_Site"));
                var siteName = Site.split(";#")[1];

                siteName = siteName.toUpperCase();
                teamName = teamName.toUpperCase();
                //alert(siteName+" : "+teamName);

                if (siteName === teamName) {
                    var svgPath = ($(this).attr("ows_Code"));
                    var svgColour = ($(this).attr("ows_bgColour"));
                    //alert(Site + svgColour + svgPath);
                    $('#siteLogo').append('<svg xmlns="http://www.w3.org/2000/svg" class="pageLogo" viewBox="0 0 128 128" width="128" height="128">' +
                        '<g>' +
                        '<rect fill="' + svgColour + '" width="128" height="128" />' + svgPath +
                        '</g>' +
                        '</svg>');
                    count++;
                };

                if (siteName === 'HOME') {
                    homeColour = ($(this).attr("ows_bgColour"));
                    homePath = ($(this).attr("ows_Code"));
                };
            });
        }
    });

    if (count == 0) {
        $('#siteLogo').append('<svg xmlns="http://www.w3.org/2000/svg" class="pageLogo" viewBox="0 0 128 128" width="128" height="128">' +
            '<g>' +
            '<rect fill="' + homeColour + '" width="128" height="128" />' + homePath +
            '</g>' +
            '</svg> ');
    };
};