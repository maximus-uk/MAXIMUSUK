function getSiteEmail() {

	var siteEmail;
	
    // Setup SPServices Variables
    var method = "GetListItems";
    var list = "WelcomeMessage";
    var fields = "<ViewFields><FieldRef Name='email' /></ViewFields>";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
				siteEmail = ($(this).attr("ows_email"));
			});
		}
	});
	return siteEmail;
};