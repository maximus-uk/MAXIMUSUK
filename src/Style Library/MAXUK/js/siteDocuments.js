var categories = [];
var height = $(window).height();
var width = $(window).width();
var adjHeight = height / 2;
var adjWidth = width / 1.5;
var reduceWidth = width / 2.75;
var listName = "";

function getTabs(list, listID) {

    var method = "GetList";
    var ID = 0;

    $().SPServices({
        async: false,
        operation: method,
        listName: list,
        completefunc: function (xData, Status) {

            $(xData.responseXML).find("Field[DisplayName='category'] CHOICE").each(function () {
                categories[ID] = $(this).text();
                ID++;
            });
        }
    });
    categories.sort();

    if (categories.length === 0) {
        $("#tabNames").append('There currently are no items to display');
    } else {
        for (i = 0; i <= categories.length - 1; i++) {
            if (i === 0) {
                $("#tabNames").append("<li class='active'>" +
                    "<a data-toggle='pill' href='#tab0'>" + categories[0] + "</a>" +
                    "</li>");
                $("#tabData").append("<div id='tab0' class='tab-pane fade in active'>" +
                    "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xl-10 scrollbar teamDocumentFoldersContainer'>" +
                    "<div class='panel-group teamDocumentFolders' id='docFoldersTab0'></div>" +
                    "</div>" +
                    "</div>");
            }

            if (i >= 1) {
                $("#tabNames").append("<li>" +
                    "<a data-toggle='pill' href='#tab" + i + "'>" + categories[i] + "</a>" +
                    "</li>");
                $("#tabData").append('<div id="tab' + i + '" class="tab-pane fade in">' +
                    "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xl-10 scrollbar teamDocumentFoldersContainer'>" +
                    '<div class="panel-group teamDocumentFolders" id="docFoldersTab' + i + '"></div>' +
                    '</div>' +
                    '</div>');
            }
        }
    }

    if (list === 'Documents') {

        //$('#emailButton').append('<a title="Email this document library." role="button" class="button teamDocEmailButton" href="'+siteURL+'/SiteAssets/Documents.oft" id="email">'+
        //						'<i class="fa fa-envelope"></i>'+
        //						'</a>');											
        $('#myDocs').append('<a title="See your submissions to this document library." role="button" class="button teamDocMyButton" href="#" onclick = "openDialog(\'' + siteURL + '/' + list + '/Forms/my-sub.aspx\',\'My Submissions\',' + height + ',' + adjWidth + ',true); return false;">' +
            '<span class="glyphicon glyphicon-user"></span>' +
            '</a>');
    } else {
        $('#myDocs').append('<a title="See your submissions to this document library." role="button" class="button teamDocMyButton" href="#" onclick = "openDialog(\'' + siteURL + '/' + list + '/Forms/MyItems.aspx\',\'My Submissions\',' + height + ',' + adjWidth + ',true); return false;">' +
            '<span class="glyphicon glyphicon-user"></span>' +
            '</a>');
    }

    $('#addButton').append('<a title="Add a new item to this document library." role="button" class="button teamDocNewButton" onclick=\'NewItem2(event, "' + siteURL + '/_layouts/15/Upload.aspx?List={' + listID + '}&amp;RootFolder="); return false;\' href="' + siteURL + '/_layouts/15/Upload.aspx?List={' + listID + '}&amp;RootFolder=" target="_self" data-viewctr="139">' +
        '<span class="glyphicon glyphicon-plus"></span>' +
        '</a>');
}

function getFolders(URL, list) {

    // Setup Local Variables
    var pdfIcon = '<i class="fa fa-file-pdf-o redIcon" aria-hidden="true"></i>';
    var wordIcon = '<i class="fa fa-file-word-o blueIcon" aria-hidden="true"></i>';
    var xlIcon = '<i class="fa fa-file-excel-o greenIcon" aria-hidden="true"></i>';
    var ppIcon = '<i class="fa fa-file-powerpoint-o orangeIcon" aria-hidden="true"></i>';
    var docIcon = '<i class="fa fa-file-o foreBlue1" aria-hidden="true"></i>';
    var zipIcon = '<i class="fa fa-file-archive orangeIcon" aria-hidden="true"></i>';
    var emailIcon = '<i class="fa fa-envelope forePurple1" aria-hidden="true"></i>';
    var icon;
    var folderSection = "";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Folder' />" +
        "<FieldRef Name='category' />" +
        "<FieldRef Name='Sub_x002d_Folder' />" +
        "<FieldRef Name='LinkFilenameNoMenu' />";

    // SP Services Variables
    var method = "GetListItems";
    var query = "<Query><OrderBy><FieldRef Name='Folder' Ascending='True' /><FieldRef Name='Sub_x002d_Folder' Ascending='True' /><FieldRef Name='LinkFilenameNoMenu' Ascending='True' /></OrderBy></Query>";

    if (list === 'Documents') {
        fields = fields + "<FieldRef Name='_ModerationStatus' />" +
            "</ViewFields>";
    } else {
        fields = fields + "<FieldRef Name='ViewerURL' />" +
            "</ViewFields>";
        //listName = list;
    }

    for (var tabNum = 0; tabNum < categories.length; tabNum++) {

        var folderNamePrev = "";
        var subFolderPrev = "";
        var fcount = 1;
        var sf1count = 1;
        var docFlag = false;
        var docStatus = "";
        var docFolder = "";
        var docCat = "";
        var listFolder = "";
        var subFolderGroupID = "";
        var subFolderID = "";
        var subFolderDoc = "";

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
                    var ID = $(this).attr("ows_ID");
                    var tabCategory = $(this).attr("ows_category");
                    var docFolder = $(this).attr("ows_Folder");
                    var docSubFolder = $(this).attr("ows_Sub_x002d_Folder");
                    var docName = $(this).attr("ows_LinkFilenameNoMenu");
                    var docFQN = URL + '/' + list + '/' + docName;

                    if (list === 'Documents') {
                        docStatus = $(this).attr("ows__ModerationStatus");
                    } else {
                        docStatus = '0';
                    }

                    if (docName !== undefined) {
                        var docTitle = docName.split(".")[0];
                        var docType = docName.split(".")[1];
                    }

                    switch (docType) {
                        case 'pdf':
                            icon = pdfIcon;
                            break;
                        case 'doc':
                        case 'docx':
                            icon = wordIcon;
                            break;
                        case 'xls':
                        case 'xlsx':
                        case 'xlsm':
                            icon = xlIcon;
                            break;
                        case 'ppt':
                        case 'pptx':
                            icon = ppIcon;
                            break;
                        case 'xsn':
                            icon = docIcon;
                            break;
                        case 'msg':
                            icon = emailIcon;
                            break;
                        case 'zip':
                        case 'rar':
                            icon = zipIcon;
                            break;
                        default:
                            icon = docIcon;
                            break;
                    }

                    if (tabCategory === categories[tabNum] && docStatus === '0') {

                        var documentString = '<div class="row" style="margin-bottom:5px">' +
                            '<div class="col-sm-2 col-md-2 col-lg-2 iconContainer">' +
                            '<nobr>' +
                            '<div class="docIcon">' + icon + '</div>' +
                            '<a class="docView" href ="#" onclick = "openDialog(\'' + URL + '/' + list + '/Forms/Display.aspx?ID=' + ID + '\',\'File Properties\',500,680); return false;" title = "view document information" > <i class="fa fa-info" aria-hidden="true"></i></a>' +
                            '<a class="docEdit" href="#" onclick="openDialog(\'' + URL + '/' + list + '/Forms/Edit.aspx?ID=' + ID + '\',\'File Properties\',500,680); return false;" title="edit document information" > <i class="fa fa-pencil" aria-hidden="true"></i></a >' +
                            '<a class="docDelete" href="#" onclick="deleteDoc(\'' + URL + '\',\'' + list + '\',' + ID + '); return false;" title="delete document"><i class="fa fa-remove" aria-hidden="true"></i></a >' +
                            '</nobr>' +
                            '</div>' +
                            '<div class="col-sm-8 col-md-8 col-lg-8 text-left">' +
                            '<p class="docItem"><a href="' + docFQN + '" title="open document">' + docTitle + '</a></p>' +
                            '</div>' +
                            '</div>';

                        if (docFolder !== undefined) {
                            var folderName = docFolder.split(';#')[1];

                            if (folderName === folderNamePrev && docSubFolder === undefined) {
                                $('#' + listFolder + 'Doc').append(documentString);
                            }

                            if (folderName !== folderNamePrev) {
                                listFolder = "tab" + tabNum + "-folder" + fcount;

                                var folderString = '<div class="panel documentFolder">' +
                                    '<a class="accordion-toggle" data-toggle="collapse" data-parent="#docFoldersTab' + tabNum + '" href="#' + listFolder + '" style="text-decoration:none">' +
                                    '<div class="panel-heading">' +
                                    '<div class="panel-title">' +
                                    '<h5 class="folderTitle"><span class="glyphicon glyphicon-folder-close" style="padding-right:10px"></span>' + folderName + '</h5>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '<div id="' + listFolder + '" class="panel-collapse collapse docList">' +
                                    '<div class="panel-body" id="' + listFolder + 'rootPanel">' +
                                    '<div class="list-group" id="' + listFolder + 'Doc">' +
                                    '<div class="row" style="margin-bottom:5px">' +
                                    '<div class="col-sm-2 col-md-2 col-lg-2 iconContainer">' +
                                    '<nobr>' +
                                    '<div class="docIcon">' + icon + '</div>' +
                                    '<a class="docView" href ="#" onclick = "openDialog(\'' + URL + '/' + list + '/Forms/Display.aspx?ID=' + ID + '\',\'File Properties\',500,680); return false;" title = "view document information" > <i class="fa fa-info" aria-hidden="true"></i></a>' +
                                    '<a class="docEdit" href="#" onclick="openDialog(\'' + URL + '/' + list + '/Forms/Edit.aspx?ID=' + ID + '\',\'File Properties\',500,680); return false;" title="edit document information" > <i class="fa fa-pencil" aria-hidden="true"></i></a >' +
                                    '<a class="docDelete" href="#" onclick="deleteDoc(\'' + URL + '\',\'' + list + '\',' + ID + '); return false;" title="delete document"><i class="fa fa-remove" aria-hidden="true"></i></a >' +
                                    '</nobr>' +
                                    '</div>' +
                                    '<div class="col-sm-8 col-md-8 col-lg-8 text-left">' +
                                    '<p class="docItem"><a href="' + docFQN + '" title="open document">' + docTitle + '</a></p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';

                                docFlag = true;
                                $('#docFoldersTab' + tabNum).append(folderString);
                                fcount++;
                            }

                            // **** check for sub-folder levels
                            if (docSubFolder !== undefined) {
                                var subFolderName = docSubFolder.split(';#')[1];
                                subFolderGroupID = listFolder + "-subfolders";
                                $('#' + listFolder + 'rootPanel').append('<div class="panel-group" id="' + subFolderGroupID + '"></div>');

                                // **** if this is the same folder as before add new document to it
                                if (subFolderName === subFolderPrev) {
                                    $('#' + subFolderDoc).append(documentString);
                                }

                                if (subFolderName !== subFolderPrev) {
                                    subFolderID = listFolder + "-subfolder" + sf1count;
                                    subFolderDoc = subFolderID + "Doc";

                                    var subFolderString = '<div class="panel panel-default documentFolder">' +
                                        '<a class="accordion-toggle" data-toggle="collapse" data-parent="#' + subFolderGroupID + '" href="#' + subFolderID + '">' +
                                        '<div class="panel-heading">' +
                                        '<div class="panel-title">' +
                                        '<h5 class="folderTitle"><span class="glyphicon glyphicon-folder-close" style="padding-right:10px"></span>' + subFolderName + '</h5>' +
                                        '</div>' +
                                        '</div>' +
                                        '</a>' +
                                        '<div id="' + subFolderID + '" class="panel-collapse collapse">' +
                                        '<div class="panel-body">' +
                                        '<div class="list-group" id="' + subFolderDoc + '">' +
                                        '<div class="row" style="margin-bottom:5px">' +
                                        '<div class="col-sm-2 col-md-2 col-lg-2 iconContainer">' +
                                        '<nobr>' +
                                        '<div class="docIcon">' + icon + '</div>' +
                                        '<a class="docView" href ="#" onclick = "openDialog(\'' + URL + '/' + list + '/Forms/Display.aspx?ID=' + ID + '\',\'File Properties\',500,680); return false;" title = "view document information" > <i class="fa fa-info" aria-hidden="true"></i></a>' +
                                        '<a class="docEdit" href="#" onclick="openDialog(\'' + URL + '/' + list + '/Forms/Edit.aspx?ID=' + ID + '\',\'File Properties\',500,680); return false;" title="edit document information" > <i class="fa fa-pencil" aria-hidden="true"></i></a >' +
                                        '<a class="docDelete" href="#" onclick="deleteDoc(\'' + URL + '\',\'' + list + '\',' + ID + '); return false;" title="delete document"><i class="fa fa-remove" aria-hidden="true"></i></a >' +
                                        '</nobr>' +
                                        '</div>' +
                                        '<div class="col-sm-8 col-md-8 col-lg-8 text-left">' +
                                        '<p class="docItem"><a href="' + docFQN + '" title="open document">' + docTitle + '</a></p>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';

                                    $('#' + subFolderGroupID).append(subFolderString);
                                    sf1count++;
                                }
                                subFolderPrev = subFolderName;
                            }
                            folderNamePrev = folderName;
                        }
                    } else {
                        $('#docFoldersTab' + tabNum).append(documentString);
                    }
                });
            }
        });
        if (docFlag === false) {
            $("#docFoldersTab" + tabNum).append('This category has no items to display.');
        }
    }
}

function deleteDoc(URL, list, docID) {

    //get the current client context  
    var context = SP.ClientContext.get_current();
    var docList = context.get_web().get_lists().getByTitle(list);

    //get the list item to delete
    var listItem = docList.getItemById(docID);

    //delete the list item
    listItem.deleteObject();
    context.executeQueryAsync(function () {
        $('.documentFolder').empty();
        getFolders(URL, list);
    },
        function (sender, args) {
            alert('Delete Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }
    );
}

function resizeIframe(frameName) {
    var parentDivWidth = $('#' + frameName).parent().width();
    var parentDivHeight = $('#' + frameName).parent().height();
    $("#" + frameName)[0].setAttribute("width", parentDivWidth);
    $("#" + frameName)[0].setAttribute("height", parentDivHeight);
}