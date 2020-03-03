function getContacts(url,listName) {
    
    // Setup Local Variables
    var method = "GetListItems";
    var siteURL = url;
    var siteList = listName;
    var fields = "<ViewFields>" +
                    "<FieldRef Name='ID' />" +
					"<FieldRef Name='Name' />" +
					"<FieldRef Name='WorkEmail' />" +
					"<FieldRef Name='SiteRole' />" +
			     "</ViewFields>";
	//var query = "<Query><Where><Or><Eq><FieldRef Name='SiteRole'/><Value Type='Text'>Owner</Value></Eq><Eq><FieldRef Name='SiteRole'/><Value Type='Text'>Power User</Value></Eq></Or></Where></Query>";            
    
    $().SPServices({
        operation: method,
        async: false,
        webURL: siteURL,
        listName: siteList,
        CAMLViewFields: fields,
        //CAMLQuery: query,
        completefunc: function (xData, Status) {
            //$(xData.responseXML).find("z\\:row").each(function () {
			$(xData.responseXML).SPFilterNode("z:row").each(function () {
			
                // assign SP list item
                var ID = $(this).attr("ows_ID");
                var linkTitle = $(this).attr("ows_Name").split(';#')[1];
                var linkRole = $(this).attr("ows_SiteRole");
                var linkEmail = $(this).attr("ows_WorkEmail").split(';#')[1];

                var linkString = '<a href="mailto:' + linkEmail + '?subject=Contact from the Intranet" style="margin-top:-20px!important"><div class="list-group-item">' + linkTitle + '</div></a><div style="border-bottom:.5px solid #999"></div>';

                //console.log(linkRole+" "+linkTitle);

                switch (linkRole) {
                    case 'Owner':
                        $("#siteOwner").append(linkString);
                        break;
                    case 'Power User':
                        $("#powerUser").append(linkString);
                        break;
                    default:
                        break;
                }

               // if (linkRole == 'Owner') {
               // } else if (linkRole == 'Power User') {
               // };
            });
        }
    });
};