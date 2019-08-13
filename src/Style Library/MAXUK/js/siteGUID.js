//***** get list id using REST
function GetListGuid(listTitle) {
	var listGUID;

	try {
		//REST Query to get the List Title 
		jQuery.ajax({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listTitle + "')?$select=Id",
			type: "GET",
			async: false,
			headers: { "Accept": "application/json;odata=verbose" },
			success: function (data, textStatus, xhr) {
				listGUID = data.d.Id;
			},
			error: function (data, textStatus, xhr) {
				console.error("Error.");
			}
		});
	}
	catch (ex) {
		console.log(ex);
	}
	return listGUID;
}


//***** get list ID using CSOM
function getListId(listName) {

    //clientContext = new SP.ClientContext.get_current();    

    //if(clientContext != undefined && clientContext != null) {

    //var web = clientContext.get_web();
    var listCollection = web.get_lists();
    groupCollection = web.get_siteGroups();

    list = listCollection.getByTitle(listName);
    context.load(list, 'Id');

    //var viewCollection = list.get_views();
    //var view = viewCollection.getByTitle("Name of View");

    //context.load(view);     
    //};

    context.executeQueryAsync(Function.createDelegate(this, success), Function.createDelegate(this, error));
};

function success() {
    listID = list.get_id();
    return listID;
}

function error() {
    console.log('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}