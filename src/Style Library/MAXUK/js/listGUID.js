// ***** get list ID using REST method
// ***********************************
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

// ***** get list ID using CSOM method
// ***********************************
function getListId(listName) {

    clientContext = new SP.ClientContext.get_current();

    //if(clientContext != undefined && clientContext != null) {

    var web = clientContext.get_web();
    var listCollection = web.get_lists();
    var groupCollection = web.get_siteGroups();

    var list = listCollection.getByTitle(listName);
    clientContext.load(list, 'Id');

    //var viewCollection = list.get_views();
    //var view = viewCollection.getByTitle("Name of View");
    //context.load(view);     	
    //};

    clientContext.executeQueryAsync(Function.createDelegate(this, success), Function.createDelegate(this, error));
};

function success(sender, args) {
    //var listID = this.get_id();
    //return listID;
}

function error(sender, args) {
    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}