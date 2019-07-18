function getTeamID(teamName) {

    // Setup Local Variables
    var metaID = "";
    var method = "GetListItems";
    var list = "SiteMetaIDs";
    var URL = "https://intranet.chda.maxuk.co.uk/";
    var fields = "<ViewFields>" +
        "<FieldRed Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Metadata_x0020_ID' />" +
        "</ViewFields>";
    var query = "<Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>" + teamName + "</Value></Eq></Where></Query>";
    //alert('team='+teamName);

    $().SPServices({
        operation: method,
        async: false,
        webURL: URL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                metaID = ($(this).attr("ows_Metadata_x0020_ID"));
            });
        }
    });
    return metaID;
};
