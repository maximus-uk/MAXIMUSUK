// CREATE Operation - REST 
// listName: The name of the list you want to get items from
// weburl: The url of the web that the list is in. 
// newItemTitle: New Item title.
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function CreateListItem(siteURL, listName, newItemTitle) {

    var itemType = "SP.Data." + listName.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
    var item = {
        "__metadata": { "type": itemType },
        "Title": newItemTitle
    };
 
    $.ajax({
        url: siteURL + "/_api/web/lists/getbytitle('" + listName + "')/items",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            console.log(data + " has been created");
        },
        error: function (data) {
            console.log(err);
        }
    });
};

// READ SPECIFIC ITEM operation
// itemId: The id of the item to get
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItemWithId(siteURL,listName,itemId) {
    
    $.ajax({
        url: siteURL + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Id eq " + itemId;,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length == 1) {
                console.log(data.d.results[0]);
            }
            else {
                console.log("Multiple results obtained for the specified Id value");
            }
        },
        error: function (data) {
            console.log(err);
        }
    });
};

// occurs when a user clicks the read button
function Read(siteURL,listName) {
 
    getListItems(listName, siteURL, function (data) {
        var items = data.d.results;
 
        // Add all the new items
        for (var i = 0; i < items.length; i++) {
            console.log(items[i].Title + ":" + items[i].Id);
        }
    }, function (data) {
        alert("Ooops, an error occured. Please try again");
    });
}
 
// READ operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItems(listName, siteurl, success, failure) {
    $.ajax({
        url: siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
};

// occurs when a user clicks the update button
function Update(siteURL,listName,itemID,title) {

    updateListItem(itemId, listName, siteURL, title, function () {
        alert("Item updated, refreshing avilable items");
    }, function () {
        alert("There was an error. Please try again");
    });
}
 
// Update Operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. // title: The value of the title field for the new item
// itemId: the id of the item to update
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function updateListItem(itemId, listName, siteUrl, title, success, failure) {
    var itemType = GetItemTypeForListName(listName);
 
    var item = {
        "__metadata": { "type": itemType },
        "Title": title
    };
 
    getListItemWithId(itemId, listName, siteUrl, function (data) {
        $.ajax({
            url: data.__metadata.uri,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": data.__metadata.etag
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    }, function (data) {
        failure(data);
    });
};

// occurs when a user clicks the delete button
function Delete(siteURL, listName, itemId) {
    deleteListItem(itemId, listName, siteURL, function () {
        alert("Item deleted successfully");
    }, function () {
        alert("Ooops, an error occured. Please try again");
    });
}
 
// Delete Operation
// itemId: the id of the item to delete
// listName: The name of the list you want to delete the item from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function deleteListItem(itemId, listName, siteUrl, success, failure) {
    getListItemWithId(itemId, listName, siteUrl, function (data) {
        $.ajax({
            url: data.__metadata.uri,
            type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": data.__metadata.etag
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    },
   function (data) {
       failure(data);
   });
};