var docTabs=[];
var scrollRight = $('.scroller-right');
var scrollLeft = $('.scroller-left');
var tabList = $('.list');
var i=0;

var widthOfList = function(){
    var itemsWidth = 0;
    $('.list a').each(function () {
        var itemWidth = $(this).outerWidth();
        itemsWidth += itemWidth;
    });
    return itemsWidth;
};

var widthOfHidden = function () {
    return (($('.knowledgeTabContainer').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
};

var getLeftPosi = function () {
    return tabList.position().left;
};

scrollRight.click(function () {
    scrollLeft.fadeIn('slow');
    scrollRight.fadeOut('slow');
    tabList.animate({ left: "+=" + widthOfHidden() + "px" }, 'slow', function () {});
});

scrollLeft.click(function () {
    scrollRight.fadeIn('slow');
    scrollLeft.fadeOut('slow');
    tabList.animate({ left: "-=" + getLeftPosi() + "px" }, 'slow', function () {});
}); 

function getKnowledgeDocs(team,buName,list,tabName,tabNum) {

    reAdjust();    
    console.log(buName); 

    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    var siteName = siteURL.split("/")[5];

    $().SPServices({
        operation: "GetGroupCollectionFromUser",
        userLoginName: $().SPServices.SPGetCurrentUser(),
        async: false,
        completefunc: function (xData, Status) {

            //If the current User does belong to the group "SharePoint Power User Group Name"
            if ($(xData.responseXML).find("Group[Name='" + buName + " Power Users']").length === 1){
                hasEdit = true;                          
                $('#uploadButton'+tabNum).append('<a class="docUpload button btn" role="button" id="docUpload" target="_blank" href="'+listURL+list+'"><i class="fas fa-file-upload" aria-hidden="true"></i> Upload</a >');                                        
            } else {
                hasEdit = false;
            }

            if ($(xData.responseXML).find("Group[Name='" + team + " Power Users']").length === 1) {
                hasEdit = true;
                if (list === "Documents"){
                    //for (var docx=0; docx < docTabs.length; docx++) {
                        //var tabCount = count+docx+1;                            
                    ('#uploadButton'+tabNum).append('<a class="docUpload button btn" role="button" id="docUpload" target="_blank" href="'+listURL+list+'/Forms/'+siteName+'.aspx"><i class="fas fa-file-upload" aria-hidden="true"></i> Upload</a >');                            
                    //}
                }                    
            } else {
                hasEdit = false;
            }
        }
    }); 

    if( $('#knLibrary'+tabNum).contents().length !== 0) {return false;}
    
    $("#knLibrary"+tabNum).empty();   
    $('.toast').toast('hide'); 
    //progressMove();

    // Setup Local Variables
    //var url = _spPageContextInfo.webAbsoluteUrl;
    var pdfIcon = '<i class="fa fa-file-pdf redIcon" aria-hidden="true"></i>';
    var wordIcon = '<i class="fa fa-file-word blueIcon" aria-hidden="true"></i>';
    var xlIcon = '<i class="fa fa-file-excel greenIcon" aria-hidden="true"></i>';
    var ppIcon = '<i class="fa fa-file-powerpoint orangeIcon" aria-hidden="true"></i>';
    var fileIcon = '<i class="fa fa-file-alt foreBlue1" aria-hidden="true"></i>';
    var zipIcon = '<i class="fa fa-file-archive orangeIcon" aria-hidden="true"></i>';
    var emailIcon = '<i class="fa fa-envelope forePurple1" aria-hidden="true"></i>';
    var icon;
    var hasEdit = false;
    var docCount = 0;
    var docFlag = false;
    //var genFlag = false;
    //var mgmtFlag = false;
    var folderNamePrev = "";
    var subFolderPrev = "";
    var docNamePrev = "";
    var docType = "";
    //var teamSites = [];
    var sf1count = 1;
    var fCount = 1;
    var folderID = "";
    var folderDoc = "";
    var subFolderGroupID = "";
    var subFolderID = "";
    var subFolderDoc = "";
    var folderString = "";
    var subFolderString = "";  
    var documentString = "";

    // JSOM / SP Services Variables   
    var method = "GetListItems";
    var query = "";
    //var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    //var siteName = siteURL.split("/")[5];
    //var tenantURL = siteURL.split("sites")[0];
    var fields = "<ViewFields>" +
    "<FieldRef Name='ID' />" +
    "<FieldRed Name='DocIcon' />" +
    "<FieldRef Name='Title' />"+
    "<FieldRef Name='LinkFilenameNoMenu' />" +
    "<FieldRef Name='KnowledgeCategory' />"+
    "<FieldRef Name='KnowledgeFolder' />"+
    "<FieldRef Name='KnowledgeSubFolder' />" +
    "<FieldRef Name='_ModerationStatus' />" +
    //"<FieldRed Name='Edit' />" +
    "<FieldRef Name='KnowledgeTeam' />" +
    "<FieldRef Name='KnowledgeSharedWith' />" +
    "<FieldRef Name='KnowledgeOffice' />" +
    "</ViewFields>";
    if (list === "Documents"){
        query = "<Query>"+
                    "<Where>"+
                        "<And>"+
                            "<And>" +
                                "<Eq><FieldRef Name='KnowledgeCategory'/><Value Type='Text'>"+tabName+"</Value></Eq>"+
                                "<Eq><FieldRef Name='KnowledgeTeam'/><Value Type='Text'>"+team+"</Value></Eq>"+
                            "</And>" +
                            "<Eq><FieldRef Name='KnowledgeSharedWith'/><Value Type='Text'>All</Value></Eq>"+                            
                        "</And>"+
                    "</Where>"+
                    "<OrderBy>" +
                        "<FieldRef Name='KnowledgeFolder' Ascending='True' />"+
                        "<FieldRef Name='KnowledgeSubFolder' Ascending='True' />"+
                        "<FieldRef Name='LinkFilenameNoMenu' Ascending='True' />"+
                    "</OrderBy>"+
                "</Query>";
    }else {
        query = "<Query>"+
                    "<Where>"+
                        "<Or>"+
                            "<And>" +
                                "<Eq><FieldRef Name='KnowledgeCategory'/><Value Type='Text'>"+tabName+"</Value></Eq>"+
                                "<Eq><FieldRef Name='KnowledgeTeam'/><Value Type='Text'>"+team+"</Value></Eq>"+
                            "</And>" +
                            "<Or>" +
                                "<Contains><FieldRef Name='KnowledgeSharedWith'/><Value Type='Text'>"+team+"</Value></Contains>"+                
                                "<Eq><FieldRef Name='KnowledgeSharedWith'/><Value Type='Text'>All</Value></Eq>"+                            
                            "</Or>" +
                        "</Or>"+
                    "</Where>"+
                    "<OrderBy>" +
                        "<FieldRef Name='KnowledgeFolder' Ascending='True' />"+
                        "<FieldRef Name='KnowledgeSubFolder' Ascending='True' />"+
                        "<FieldRef Name='LinkFilenameNoMenu' Ascending='True' />"+
                    "</OrderBy>"+
                "</Query>";
    }   

    console.time('spservices');               
    $().SPServices({
        operation: method,
        async: false,
        webURL: listURL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,

        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                progressMove();
                // assign SP list item         
                //var docCat = $(this).attr("ows_KnowledgeCategory");                                 
                var docIcon = $(this).attr("ows_DocIcon");
                var docID = $(this).attr("ows_ID");
                var docName = $(this).attr("ows_LinkFilenameNoMenu");
                var docTitle = $(this).attr("ows_LinkFilenameNoMenu").split(".")[0];
                var docFolder = $(this).attr("ows_KnowledgeFolder");
                var docSubFolder = $(this).attr("ows_KnowledgeSubFolder");
                var docStatus = $(this).attr("ows__ModerationStatus");
                //var docChecked = $(this).attr("ows_Edit");
                //var otherTeams = $(this).attr("ows_KnowledgeSharedWith");
                //var sharedTeam = "none";
                //var docFQN = listURL + list + '/' + docName;
                //var docFQNLength = docFQN.length;  
                var powerUserTools = "";  

/*                if (i == 0) {
                    i = 1;
                    var elem = document.getElementById("progressBar");
                    var width = 10;
                    var id = setInterval(frame, 10);
                    function frame() {
                        if (width >= 100) {
                            clearInterval(id);
                            i = 0;
                        } else {
                            width++;
                            elem.style.width = width + "%";
                            elem.innerHTML = width + "%";
                        }
                    }
                } 
*/
                /*var progress = setInterval(function () {
                    var $bar = $('.bar');
                
                    if ($bar.width() >= 400) {
                        clearInterval(progress);
                        $('.progress').removeClass('active');
                    } else {
                        $bar.width($bar.width() + 40);
                    }
                    $bar.text($bar.width() / 4 + "%");
                }, 800); */

                switch (docIcon) {
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
                        icon = fileIcon;
                        break;
                    case 'msg':
                        icon = emailIcon;
                        break;
                    case 'zip':
                    case 'rar':
                        icon = zipIcon;
                        break;
                    default:
                        icon = fileIcon;
                        break;
                }

                switch (docStatus){
                    case '0': //The list item is approved.
                        if(hasEdit){
                            powerUserTools = '<a class="docEdit" id="docEdit" href="#" onclick="editDoc(\''+list+'\',\''+docName+'\',\''+docType+'\',\''+docID+'\');return false;" title="edit document"><i class="fa fa-edit"></i></a>'+
                            '<a class="docDelete" id="docDelete" href="#" onclick="deleteDoc(\'' + tabNum + '\',\'' + team + '\',\'' + buName + '\',\'' + list + '\',' + docID + '); return false;" title="delete document"><i class="fas fa-trash-alt" aria-hidden="true"></i></a >';
                        }
                        documentString = '<div class="row docRow">' +
                            '<div class="col iconContainer">' +
                            '<nobr>' +  // document tool kit goes here
                            '<div class="docIcon">' + icon + '</div>' +
                            '<a class="docView" href="#" onclick="viewDoc(\''+list+'\',\''+docName+'\',\''+docType+'\',\''+docID+'\');return false;" title="view document"><i class="fa fa-eye"></i></a>' +
                            powerUserTools +
                            '</nobr>' +
                            '</div>' +
                            '<div class="col text-left docItem">' + 
                            '<a href="#" onclick="openDoc(\''+list+'\',\''+docName+'\',\''+docType+'\',\''+docID+'\');return false" title="open document"><p class="text-truncate">' + docTitle + '</p></a>' +
                            '</div>' +
                            '</div>';        
                        break;
                    case '3': //The list item is in the draft or checked out state.
                        if(hasEdit){
                            powerUserTools = '<a class="docEdit" id="docEdit" href="#" onclick="editDoc(\''+list+'\',\''+docName+'\',\''+docType+'\',\''+docID+'\');return false;" title="edit document"><i class="fa fa-edit"></i></a>'+
                                '<a class="docDelete" id="docDelete" href="#" onclick="deleteDoc(\'' + tabNum + '\',\'' + team + '\',\'' + buName + '\',\'' + list + '\',' + docID + '); return false;" title="delete document"><i class="fas fa-trash-alt" aria-hidden="true"></i></a >' +
                                '<a class="docPublish" id="docPublish" href="#" onclick="publishDoc(\'' + tabNum + '\',\'' + team + '\',\'' + buName + '\',\'' + list + '\',' + docID + '); return false;" title="publish draft document"><i class="fas fa-file" aria-hidden="true"></i></a >';                               

                            documentString = '<div class="row docRow">' +
                                '<div class="col iconContainer">' +
                                '<nobr>' +  // document tool kit goes here
                                '<div class="docIcon">' + icon + '</div>' +
                                '<a class="docView" href="#" onclick="viewDoc(\''+list+'\',\''+docName+'\',\''+docType+'\',\''+docID+'\');return false;" title="view document"><i class="fa fa-eye"></i></a>' +
                                powerUserTools +
                                '</nobr>' +
                                '</div>' +
                                '<div class="col text-left docItem">' + 
                                '<a href="#" onclick="openDoc(\''+list+'\',\''+docName+'\',\''+docType+'\',\''+docID+'\');return false" title="open document"><p class="text-truncate">' + docTitle + '</p></a>' +
                                '</div>' +
                                '</div>';                                 
                        }else {
                            documentString="";
                        }                          
                        break;
                    case '1': //The list item has been denied approval.
                    case '2': //The list item is pending approval.
                    case '4': //The list item is scheduled for automatic approval at a future date.
                    default :
                        documentString="";                       
                        break;
                } 

                // **** check for folder level
                if (docFolder !== undefined) {
                    var folderName = docFolder.split(';#')[1];
                    if (folderName !== folderNamePrev) {
                        // ***** Setup Parent Folder 
                        folderID =  'knTab' + tabNum + '-Folder' + fCount;
                        folderDoc = folderID + "Doc";
                        folderString = '<div class="card documentFolder">' +
                            '<a class="card-link accordion-toggle" data-toggle="collapse" data-parent="#knLibrary' + tabNum + '" href="#' + folderID + '" style="text-decoration:none">' +
                            '<div class="card-header">' +
                            //'<span class="badge badge-info">'+docCount+'</span>' +
                            '<h5 class="folderTitle">' + folderName + '</h5>' +
                            '</div>' +
                            '</a>' +
                            '<div id="' + folderID + '" class="collapse docList">' +
                            '<div class="card-body" id="' + folderID + 'rootPanel">' +
                            '<div id="' + folderDoc + '">' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';                           

                        if (docStatus === '0' || (docStatus !== '0' && hasEdit)){
                            $('#knLibrary' + tabNum).append(folderString);                               
                            docFlag = true;
                            fCount++;
                            folderNamePrev = folderName;
                        }
                    }

                    // **** check for sub-folder level
                    if (docSubFolder !== undefined) {
                        subFolderName = docSubFolder.split(';#')[1];
                        subFolderGroupID = folderID + "-subfolders";
                        $('#' + folderID + 'rootPanel').append('<div id="' + subFolderGroupID + '"></div>');

                        if (subFolderName !== subFolderPrev) {
                            subFolderID = folderID + "-subfolder" + sf1count;
                            subFolderDoc = subFolderID + "Doc";
                            subFolderString = '<div class="card documentFolder">' +
                            '<a class="card-link accordion-toggle" data-toggle="collapse" data-parent="#' + subFolderGroupID + '" href="#' + subFolderID + '">' +
                            '<div class="card-header">' +
                            '<h5 class="folderTitle">' + subFolderName + '</h5>' +
                            '</div>' +
                            '</a>' +
                            '<div id="' + subFolderID + '" class="collapse">' +
                            '<div class="card-body">' +
                            '<div id="' + subFolderDoc + '">' + documentString +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';                                    
                            if (docStatus === '0' || (docStatus !== '0' && hasEdit)){
                                $('#' + subFolderGroupID).append(subFolderString);
                                sf1count++;
                            }
                        }

                        // **** if this is the same folder as before add new document to it
                        if (subFolderName === subFolderPrev) {
                            $('#' + subFolderDoc).append(documentString);
                        }
                        subFolderPrev = subFolderName;
                    } else if (docName !== docNamePrev) {
                        $('#' + folderDoc).append(documentString);
                    }  
                } else {
                    $('#knLibrary' + tabNum ).append(documentString);
                }
                docNamePrev = docName;                
                docCount++;
            });              
        }
    });   

    if (docFlag==false) {                    
        $("#knLibrary" + tabNum ).append('<h4>There are no documents in this library</h4>');
    }  
    console.timeEnd('spservices');
    console.log("doc count="+docCount); 
    //$('.toast').toast('hide'); 
    //$('#tabLoadMessage').addClass('hidden');
    return false;
}

function viewDoc(list,docName,docType, id){
    var docGUID = "";
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    $('#docViewer').prop('src',listURL+'/'+list+'/'+docName+'?web=1&action=view');
    return false;
}

function openDoc(list,docName,docType,id){
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    var relURL = "/"+siteURL.split('/')[3]+"/"+siteURL.split('/')[4]+"/knowledge/"+list+"/"+docName;
    var docLink = "";
    
    //console.log(listURL+"_api/web/GetFileByServerRelativeUrl('"+relURL+"')");

    switch (docType) {
        case 'pdf':
            window.open(relURL);
            break;
        case 'doc':
        case 'docx':
        case 'xls':
        case 'xlsx':
        case 'xlsm':
        case 'ppt':
        case 'pptx':
            $.ajax({ 
                url:  listURL + "_api/web/GetFileByServerRelativeUrl('"+relURL+"')",
                method: "GET",
                async: false,
                contentType: "application/json; odata=verbose",
                headers: { 
                    "Accept": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    //console.log(data);
                    var docGUID=data.d.UniqueId;            
                    var linkURL=data.d.LinkingUrl;
                    var docTitle = data.d.Title;
        
                   if (linkURL) {
                        // can open with office web apps
                        var owaurl = listURL + "/_layouts/15/Doc.aspx?sourcedoc={" + docGUID + "}&file=" + encodeURIComponent(docTitle) + "&action=view";                   
                        window.open(owaurl);
                    } else {                
                        // can not open with office web apps (eg:txt)
                        $('#toastHead h3').replaceWith('Document Not Supported');
                        $('#toastBody').replaceWith('This document type is not supported within Office 365 and cannot be viewed'); 
                        $('.toast').toast('show');
                    }
                },
                error: function (data, errorCode, errorMessage) {
                // error
                }
            });        
            break;

        case 'xsn':
            break;
        case 'msg':
            break;
        case 'zip':
        case 'rar':
        default:
            $('#toastHead h3').replaceWith('Document Not Supported');
            $('#toastBody').replaceWith('This document type is not supported within Office 365 and cannot be viewed'); 
            $('.toast').toast('show');            
            break;
    }
    $('.toast').toast('hide'); 
    return false;
}

function editDoc(list,docName,docType,id){
    var docGUID = "";
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    $('#docViewer').prop('src',listURL+'/'+list+'/'+docName+'?web=1&action=default');
    //https://maximusunitedkingdom.sharepoint.com/sites/esd/knowledge/documents/test%20doc%2003.xlsx?web=1&action=default
    //https://maximusunitedkingdom.sharepoint.com/teams/O365JointProjectTeam/_layouts/15/Doc.aspx?OR=teams&action=edit&sourcedoc={4D97F331-BB87-4C71-AB25-DFAB72DC21B9}

/*    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    var relURL = "/"+siteURL.split('/')[3]+"/"+siteURL.split('/')[4]+"/"+siteURL.split('/')[5]+"/"+list+"/"+docName;

    $.ajax({ 
        url:  listURL + "/_api/web/GetFileByServerRelativeUrl('"+relURL+"')",
        method: "GET",
        async: false,
        contentType: "application/json; odata=verbose",
        headers: { 
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            //console.log(data);
            var docGUID=data.d.UniqueId;            
            var linkURL=data.d.LinkingUrl;
            var docTitle = data.d.Title;

           if (linkURL) {
                // can open with office web apps
                var owaurl = listURL + "/_layouts/15/Doc.aspx?sourcedoc={" + docGUID + "}&file=" + encodeURIComponent(docTitle) + "&action=default";                   
                window.open(owaurl);
            } else {                
                // can not open with office web apps (eg:txt)
                $('#toastHead h3').append('Document Not Supported');
                $('#toastBody').append('This document type is not supported within Office 365 and cannot be viewed'); 
                $('.toast').toast('show');                
            }
        },
        error: function (data, errorCode, errorMessage) {
        // error
        }
    });
*/
    return false;    
}

function deleteDoc(docTabCount, siteTitle, buName, list, docID) {

    var puViewURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/"+list+"/Forms/"+siteURL.split("/")[5]+".aspx";
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";

    $('#toastHead h3').replaceWith('Deleting Selected Document');
    $('#toastBody').replaceWith('The site is deleting the document, please wait...'); 
    $('.toast').toast('show');

    //get the current client context  
    var context = new SP.ClientContext(listURL);
    var docList = context.get_web().get_lists().getByTitle(list);

    //get the list item to delete
    var listItem = docList.getItemById(docID);

    //delete the list item
    listItem.deleteObject();

    context.executeQueryAsync(function () {
        $('#toastHead h3').replaceWith('Document Deleted');
        $('#toastBody').replaceWith('');
        $('.toast').toast('show');
        $('.documentFolder').empty();
        getKnowledgeDocs(siteTitle, buName);
    },
        function (sender, args) {
            $('#toastHead h3').replaceWith('Delete Request Failed');
            $('#toastBody').replaceWith(args.get_message());
            $('#toastBody').append('<a class="btn button" href="'+puViewURL+'" role="button" target="_blank">Open Document Library</a>') 
            $('.toast').toast('show');
            //alert('Delete Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }
    );
    $('.toast').toast('hide'); 
    return false;
}

/*function moveDoc(list,docName){
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    var relURL = "/"+siteURL.split('/')[3]+"/"+siteURL.split('/')[4]+"/knowledge/"+list+"/"+docName;
    
    // open bootstrap dialog to get library to move document to

    //https://tenant.sharepoint.com/_api/web/getFileByServerRelativeUrl('/Shared Documents/FileName.docx')/moveTo(newurl='/Shared Documents/FolderName/FileName.docx',flags=1)

    $.ajax({ 
        url:  listURL + "_api/web/GetFileByServerRelativeUrl('"+relURL+"')/moveTo(newurl='"+newURL+"',flags=1)",
        method: "GET",
        async: false,
        contentType: "application/json; odata=verbose",
        headers: { 
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            //console.log(data);
            var docGUID=data.d.UniqueId;            
            var linkURL=data.d.LinkingUrl;
            var docTitle = data.d.Title;

            $('#toastHead h3').replaceWith('Document Not Supported');
            $('#toastBody').replaceWith('This document type is not supported within Office 365 and cannot be viewed'); 
            $('.toast').toast('show');
        },
        error: function (data, errorCode, errorMessage) {
            // error
        }
    });        
}

function uploadDoc(siteTitle, buName, list) {
    
}*/

function publishDoc(docTabCount, siteTitle, buName, list, docID) {

    var puViewURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/"+list+"/Forms/"+siteURL.split("/")[5]+".aspx";
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    
    $('#toastHead h3').replaceWith('Publishing Selected Document');
    $('#toastBody').replaceWith('The site is publishing the document, please wait...'); 
    $('.toast').toast('show');

    //get the current client context  
    var context = new SP.ClientContext(listURL);
    var docList = context.get_web().get_lists().getByTitle(list);

    //get the list item to delete
    var listItem = docList.getItemById(docID);
    //console.log(docID+" "+listItem+" "+puViewURL);

    //publish the list item
    listItem.get_file().publish("Published by Power User");
    context.load(listItem);
    context.executeQueryAsync(function () {
        //var majorVersion = listItem.get_majorVersion();
        $('#toastHead h3').replaceWith('Document Published');
        $('#toastBody').replaceWith(' Major Version of the document has been published'); 
        $('.toast').toast('show');
        $('.documentFolder').empty();
        getKnowledgeDocs(siteTitle, buName);
    },
        function (sender, args) {
            $('#toastHead h3').replaceWith('Publish Document Request Failed');
            $('#toastBody').replaceWith(args.get_message());
            $('#toastBody').append('<br/><a class="btn button" href="'+puViewURL+'" role="button" target="_blank">Open Document Library</a>') 
            $('.toast').toast('show');
            //alert('Delete Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }
    );
    return false;
}

function getDocTabs(buName,team,callback){
    var tabNum=7;
    var docContentString = "";
    var docTabString = "";
    var termSet;
    var parentTerm;    
    var siteName="";
    var siteurl =  siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4];

    buName=buName.toUpperCase();
    
    for(var x=1;x<=5;x++){
        $('#knowledgeTabContent').append("<div id='knTab"+x+"' class='tab-pane fade'><h3 class='pulsate' id='tabLoadMessage'></h3><div id='uploadButton"+x+"'></div><div id='knLibrary"+x+"'></div></div>");                    
    }
    $('#knowledgeTabNames').append("<a class='nav-item nav-link' data-toggle='pill' role='pill' onclick='getKnowledgeDocs(\""+team+"\",\""+buName+"\",\"Policies\",\"Policies\",\"1\")' href='#knTab1'>Policies</a>");
    $('#knowledgeTabNames').append("<a class='nav-item nav-link' data-toggle='pill' role='pill' onclick='getKnowledgeDocs(\""+team+"\",\""+buName+"\",\"Procedures\",\"Procedures\",\"2\")' href='#knTab2'>Procedures</a>");
    $('#knowledgeTabNames').append("<a class='nav-item nav-link' data-toggle='pill' role='pill' onclick='getKnowledgeDocs(\""+team+"\",\""+buName+"\",\"Guides\",\"Guides\",\"3\")' href='#knTab3'>Guides</a>");
    $('#knowledgeTabNames').append("<a class='nav-item nav-link' data-toggle='pill' role='pill' onclick='getKnowledgeDocs(\""+team+"\",\""+buName+"\",\"Forms\",\"Forms\",\"4\")' href='#knTab4'>Forms</a>");
    $('#knowledgeTabNames').append("<a class='nav-item nav-link' id='genTab' data-toggle='pill' role='pill' onclick='getKnowledgeDocs(\""+team+"\",\""+buName+"\",\"General\",\"General\",\"5\")' href='#knTab5'>General</a>");

    $.ajax({
        url: siteurl + "/_api/web/title",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            siteName=data.d.Title;
            $().SPServices({
                operation: "GetGroupCollectionFromUser",
                userLoginName: $().SPServices.SPGetCurrentUser(),
                async: false,
                completefunc: function (xData, Status) {
                    //If the current User does belong to the group "SharePoint Group Name"
                    if ($(xData.responseXML).find("Group[Name='" + siteName + " Managers']").length === 1) {
                        $('#genTab').after("<a class='nav-item nav-link' data-toggle='pill' role='pill' onclick='getKnowledgeDocs(\""+team+"\",\""+buName+"\",\"Management\",\"Management\",\"6\")' href='#knTab6'>Management</a>"+
                                           "<div style='border-right:1px solid #545487'>&nbsp</div>");
                        $('#knowledgeTabContent').append("<div id='knTab6' class='tab-pane fade'><h3 class='pulsate' id='tabLoadMessage'></h3><div id='uploadButton6'></div><div id='knLibrary6'></div></div>");                    
                    }else {
                        $('#genTab').after("<div style='border-right:1px solid #545487'>&nbsp</div>");
                    } 
                }
            });
        },error: function (data) {
            console.log("Error: "+ data);
        }
    });
    
    //Current Context
    var context = SP.ClientContext.get_current();
    
    //Current Taxonomy Session
    var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
    
    //Term Stores
    var termStores = taxSession.get_termStores();
    
    //Name of the Term Store from which to get the Terms.
    var termStore = termStores.getByName("Taxonomy_FdWU0+B2IwWZEI4C5ogoWw==");
    
    //GUID of Term Set from which to get the Terms.
    switch(buName){
        case 'MAXIMUS UK':
            termSet = termStore.getTermSet("fc61f819-1a31-4f0b-b1aa-9dc2b3a73684");  // *** Knowledge Library term set
            parentTerm = termSet.getTerm('feb3d3c8-d948-4d3e-b997-a2ea74653b3e');  // *** Documents term set
            break;    
        case 'CHDA':
            termSet = termStore.getTermSet("378b89de-cdbf-4a36-8977-1caa0ddb63bf");  // *** Knowledge Library term set
            parentTerm = termSet.getTerm('90a0a9eb-bbcc-4693-9674-e56c4d41375f');  // *** Documents term set
            break;
        case 'ESD':
            termSet = termStore.getTermSet("051cc33c-d301-40b7-a53c-ae174ece911c");  // *** Knowledge Library term set
            switch(team){
                case "Delivery Partners":
                    parentTerm = termSet.getTerm("13c10b04-00a1-42d8-879b-b0d2a1cf06be");  // *** Documents term set
                    break;
                default:
                    parentTerm = termSet.getTerm("1ce3872e-135c-44ec-8a3f-ce06c5e644ae");  // *** Documents term set
                    break;
            }
            break;
        case 'HML':
            termSet = termStore.getTermSet("b18cf4fd-ceb9-43f6-9cf6-1afc1bf5089b");  // *** Knowledge Library term set
            parentTerm = termSet.getTerm('feb3d3c8-d948-4d3e-b997-a2ea74653b3e');  // *** Documents term set
            break;   
        case 'REVITALISED':
            termSet = termStore.getTermSet("3b4db1af-5987-4b50-9d16-a31f857198f1");  // *** Knowledge Library term set
            parentTerm = termSet.getTerm('feb3d3c8-d948-4d3e-b997-a2ea74653b3e');  // *** Documents term set
            break;    
    }
    
    var terms = parentTerm.get_terms();
    context.load(terms);
    context.executeQueryAsync(function(){
    
        var termEnumerator = terms.getEnumerator();    
        while(termEnumerator.moveNext()){
            var currentTerm = termEnumerator.get_current();     
            var tabName = currentTerm.get_name();
        
            docContentString="<div id='knTab"+tabNum+"' class='tab-pane fade'><h3 class='pulsate' id='tabLoadMessage'></h3><div id='uploadButton"+tabNum+"'></div><div id='knLibrary"+tabNum+"'></div></div>";
            docTabString = "<a class='nav-item nav-link' data-toggle='pill' role='pill' onclick='showText(\""+team+"\",\""+buName+"\",\"Documents\",\""+tabName+"\",\""+tabNum+"\")' href='#knTab"+tabNum+"'>"+tabName+"</a>";
            docTabs.push(tabName);
            $('#knowledgeTabNames').append(docTabString);
            $('#knowledgeTabContent').append(docContentString);
            tabNum++;
        } 
        callback(tabNum);
    },function(sender,args){
        console.log(args.get_message());
    });
    return false;
}

function showText(team,buName,list,tabName,tabNum){
    //$('#tabLoadMessage').removeClass('hidden');
    //$('#tabLoadMessage').append('Getting Category Documents, please wait...');
    
    $('#toastHead h3').html('Getting Category Documents');
    $('#toastBody').html('Please wait whilst the documents load' +
                        '<div class="progress">' +
                        '<div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 0%;"></div>' +
                        '</div>');
    $('.toast').toast('show');     
    setTimeout(
        function() 
        {
            getKnowledgeDocs(team,buName,list,tabName,tabNum);
        }, 250);
}

function progressMove() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("progressBar");
    var width = 10;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
      }
    }
  }
}

/*
function checkFolder() {

    //	$(".docList").on('shown.bs.collapse', function(){
    //		$(this).parent().find(".glyphicon-folder-close").removeClass("glyphicon-folder-close").addClass("glyphicon-folder-open");
    //	});

    //	$(".docList").on('hidden.bs.collapse', function(){
    //		$(this).parent().find(".glyphicon-folder-open").removeClass("glyphicon-folder-open").addClass("glyphicon-folder-close");
    //	});
}

function openDialog(url, name, height, width, close) {
    if (close === undefined) { close = true; }
    var options = SP.UI.$create_DialogOptions();
    options.url = url;
    options.height = height;
    options.width = width;
    options.title = name;
    options.showClose = close;
    options.showMaximized = false;
    options.dialogReturnValueCallback = function (dialogResult, value) {
        SP.UI.ModalDialog.RefreshPage(dialogResult);
        if (value === "1") { window.parent.location.reload(); return value; }
    };
    SP.UI.ModalDialog.showModalDialog(options);
} */