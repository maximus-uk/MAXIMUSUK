function getKnowledgeDocs(team) {

    // Setup Local Variables
    //var url = _spPageContextInfo.webAbsoluteUrl;
    var pdfIcon = '<i class="fa fa-file-pdf redIcon" aria-hidden="true"></i>';
    var wordIcon = '<i class="fa fa-file-word blueIcon" aria-hidden="true"></i>';
    var xlIcon = '<i class="fa fa-file-excel greenIcon" aria-hidden="true"></i>';
    var ppIcon = '<i class="fa fa-file-powerpoint orangeIcon" aria-hidden="true"></i>';
    var docIcon = '<i class="fa fa-file-alt foreBlue1" aria-hidden="true"></i>';
    var zipIcon = '<i class="fa fa-file-archive orangeIcon" aria-hidden="true"></i>';
    var emailIcon = '<i class="fa fa-envelope forePurple1" aria-hidden="true"></i>';
    var library = ['Policies', 'Procedures', 'Guides', 'Forms', 'Documents'];
    var icon;

    // SPServices Variables
    var method = "GetListItems";
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    
    for (var count = 0; count < library.length; count++) {
        var list = library[count];
        var docCount = 0;
        var docFlag = false;
        var genFlag = false;
        var mgmtFlag = false;
        var folderNamePrev = "";
        var subFolderPrev = "";
        var docNamePrev = "";
        var docCat = "";
        var docType = "";
        var teamSites = [];
        var sf1count = 1;
        var fCount = 1;
        var listFolder = "";
        var subFolderGroupID = "";
        var subFolderID = "";
        var subFolderDoc = "";
        var fields = "<ViewFields>" +
            "<FieldRef Name='ID' />" +
            "<FieldRef Name='UniqueID' />"+
            "<FieldRef Name='Title' />"+
            "<FieldRef Name='LinkFilenameNoMenu' />" +
            "<FieldRef Name='KnowledgeCategory' />"+
            "<FieldRef Name='KnowledgeFolder' />"+
            "<FieldRef Name='KnowledgeSubFolder' />" +
            "<FieldRef Name='_ModerationStatus' />" +
            "<FieldRef Name='KnowledgeTeam' />" +
            "<FieldRef Name='KnowledgeSharedWith' />" +
            "<FieldRef Name='KnowledgeOffice' />" +
            "</ViewFields>";
        var query = "<Query><OrderBy><FieldRef Name='KnowledgeFolder' Ascending='True' /><FieldRef Name='KnowledgeSubFolder' Ascending='True' /><FieldRef Name='LinkFilenameNoMenu' Ascending='True' /></OrderBy></Query>";

        $().SPServices({
            operation: method,
            async: false,
            webURL: listURL,
            listName: list,
            CAMLViewFields: fields,
            CAMLQuery: query,

            completefunc: function (xData, Status) {
                $(xData.responseXML).SPFilterNode("z:row").each(function () {

                    // assign SP list item         
                    docCat = $(this).attr("ows_KnowledgeCategory");                                 
                    var docID = $(this).attr("ows_ID");
                    var docGUID = $(this).attr("ows_UniqueID");
                    var docName = $(this).attr("ows_LinkFilenameNoMenu");
                    var docTitle = $(this).attr("ows_LinkFilenameNoMenu").split(".")[0];
                    var docFolder = $(this).attr("ows_KnowledgeFolder");
                    var docSubFolder = $(this).attr("ows_KnowledgeSubFolder");
                    var docStatus = $(this).attr("ows__ModerationStatus");
                    var teamName = $(this).attr("ows_KnowledgeTeam");//.split(";#")[1];
                    var otherTeams = $(this).attr("ows_KnowledgeSharedWith");
                    var office = $(this).attr("ows_KnowledgeOffice");
                    var sharedTeam = "none";
                    var docFQN = listURL + list + '/' + docName;

                    if(teamName !== undefined){teamName=teamName.split(';#')[1]};

                    // ***** split teams string into seperate items and assign to array slots *****
                    if(otherTeams !== undefined){teamSites=otherTeams.split(';#')};

                    // cycle through array items for team names
                    for (inc = 1; inc <= teamSites.length - 1; inc += 2) {
                        if (teamSites[inc] === team) {
                            sharedTeam = teamSites[inc];
                        }
                    }
                    
                    switch(docCat){
                        case "":
                        case undefined:
                            docCat=list;
                            break;
                        case "Clinical Standards":
                            docCat="Standards";
                            break;
                        default:
                            docCat = docCat.split(';#')[1];
                            break;
                    }                    

                    //console.log("teamname="+teamName+" team="+team+" sharedteam="+sharedTeam+" docstatus="+docStatus);
                    
                    if ((teamName === team || sharedTeam === team || teamName === "All") && docStatus === '0') {
                        //console.log("subfolder="+docSubFolder);
                        for (var x = 1; x < docName.length; x++) {
                            if (docName.split('.')[x] !== undefined) {
                                docType = docName.split('.')[x]; 
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
                                docTitle = docTitle + "." + docName.split('.')[x];
                            }
                        }
                       
                        var documentString = '<div class="row">' +
                            '<div class="col-sm-2 col-md-2 col-lg-2 iconContainer">' +
                            '<nobr>' +  // document tool kit goes here
                            '<div class="docIcon">' + icon + '</div>' +
                            '<a class="docView" href="#" onclick="viewDoc(\''+list+'\',\''+docID+'\',\''+docName+'\',\''+docType+'\');return false;" title="view document"><i class="fa fa-eye"></i></a>' +
                            '<a class="docEdit" id="docEdit" href="#" onclick="editDoc(\''+list+'\',\''+docName+'\');return false;" title="edit document"><i class="fa fa-edit"></i></a>' +
                            '</nobr>' +
                            '</div>' +
                            '<div class="col-sm-10 col-md-10 col-lg-10 text-left docItem">' +
                            //'<p><a href="' + listURL + '_layouts/15/download.aspx?SourceUrl=' + docFQN + '" target="_blank" title="download document">' + docTitle + '</a></p>' +
                            '<p><a href="#" onclick="openDoc(\''+list+'\',\''+docName+'\',\''+docType+'\',\''+docID+'\');return false" title="open document">' + docTitle + '</a></p>' +
                            '</div>' +
                            '</div>';                                                

                        // **** check for folder level
                        if (docFolder !== undefined) {
                            var folderName = docFolder.split(';#')[1];

                            if (folderName !== folderNamePrev) {
                                listFolder = docCat + '-Folder' + fCount;
                                var folderString = '<div class="card documentFolder">' +
                                    '<a class="card-link accordion-toggle" data-toggle="collapse" data-parent="#' + docCat + '" href="#' + listFolder + '" style="text-decoration:none">' +
                                    '<div class="card-header">' +
                                    '<h5 class="folderTitle">' + folderName + '</h5>' +
                                    '</div>' +
                                    '</a>' +
                                    '<div id="' + listFolder + '" class="collapse docList">' +
                                    '<div class="card-body" id="' + listFolder + 'rootPanel">' +
                                    '<div class="" id=' + listFolder + 'Doc>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                                
                                $('#' + docCat).append(folderString);
                                docFlag = true;
                                fCount++;
                            }
                            
                            // **** check for sub-folder level
                            if (docSubFolder !== undefined) {
                                var subFolderName = docSubFolder.split(';#')[1];
                                subFolderGroupID = listFolder + "-subfolders";
                                $('#' + listFolder + 'rootPanel').append('<div id="' + subFolderGroupID + '"></div>');

                                if (subFolderName !== subFolderPrev) {
                                    subFolderID = listFolder + "-subfolder" + sf1count;
                                    subFolderDoc = subFolderID + "Doc";

                                    var subFolderString = '<div class="card documentFolder">' +
                                        '<a class="card-link accordion-toggle" data-toggle="collapse" data-parent="#' + subFolderGroupID + '" href="#' + subFolderID + '">' +
                                        '<div class="card-header">' +
                                        '<h5 class="folderTitle">' + subFolderName + '</h5>' +
                                        '</div>' +
                                        '</a>' +
                                        '<div id="' + subFolderID + '" class="collapse">' +
                                        '<div class="card-body">' +
                                        '<div class="" id="' + subFolderDoc + '">' +
                                        '<div class="row">' +
                                        '<div class="col-sm-2 col-md-2 col-lg-2 iconContainer">' +
                                        '<nobr>' +
                                        '<div class="docIcon">' + icon + '</div>' +
                                        '<a class="docView" href="#" onclick="viewDoc(\''+list+'\',\''+docID+'\'); return false;" title="view document"><i class="fa fa-eye"></i></a>' +
                                        '<a class="docEdit" id="docEdit" href="#" onclick="editDoc(\''+list+'\',\''+docName+'\');return false;" title="edit document"><i class="fa fa-edit"></i></a>' +
                                        '</nobr>' +
                                        '</div>' +
                                        '<div class="col-sm-8 col-md-8 col-lg-8 text-left docItem">' +
                                        //'<p><a href="' + listURL + '_layouts/15/download.aspx?SourceUrl=' + docFQN + '" target="_blank">' + docTitle + '</a></p>' +
                                        '<p><a href="#" onclick="openDoc(\''+list+'\',\''+docName+'\');return false" title="open document">' + docTitle + '</a></p>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';

                                    $('#' + subFolderGroupID).append(subFolderString);
                                    sf1count++;
                                }

                                // **** if this is the same folder as before add new document to it
                                if (subFolderName === subFolderPrev) {
                                    $('#' + subFolderDoc).append(documentString);
                                }
                                subFolderPrev = subFolderName;

                            } else if (docName !== docNamePrev) {
                                $('#' + listFolder + 'Doc').append(documentString);
                            }
                            folderNamePrev = folderName;
                        } else {
                            $('#' + docCat).append(documentString);
                        }
                        docNamePrev = docName;
                    }
                });

                switch(docCat){
                    case "":
                    case undefined:
                        docCat=list;
                        break;
                    case "Clinical Standards":
                        docCat="Clinical Standards";
                        break;
                    default:
                        docCat = docCat.split(';#')[1];
                        break;
                }

                if (docFlag==false) {
                    $("#" + docCat).append('<h4>There are no documents in this library</h4>');
                }
            }
            
        });
    }
}

function viewDoc(list,docID,docName,docType){

    var docGUID = "";
  
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
   
/*
        $.ajax({
            url: listURL + "/_api/web/lists/getbytitle('"+list+"')/Items/GetById("+docID+")?$select=id",
            method: "GET",
            async: false,
            headers: { 
                "Accept": "application/json; odata=verbose", 
                "content-type": "application/json;odata=verbose", 
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                var results = data.d.results;						
                console.log("results="+results);
                //console.log('doc GUID='+docGUID);
            },
            error: function (data) {
                console.log("Error: "+ data);
            }
        });
*/
    $('#docViewer').prop('src',listURL+'/'+list+'/'+docName+'?web=1&action=view');
}

function openDoc(list,docName,docType,id){
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    var relURL = "/"+siteURL.split('/')[3]+"/"+siteURL.split('/')[4]+"/"+siteURL.split('/')[5]+"/"+list+"/"+docName;
    var docLink = "";
    //var docRelURL = replace("/","%2F");

    //console.log(docRelURL);
    //console.log(listURL+" "+relURL);
/*
    switch (docType) {
        case 'pdf':
            docLink=listURL + "/Forms/AllItems.aspx?id=%2Fsites%2FCHDA%2Fknowledge%2FDocuments%2FSPO%20Development%20Decision%20Tree%2Epdf&parent=%2Fsites%2FCHDA%2Fknowledge%2FDocuments";
            "
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
*/
    //PDF link
    //https://maximusukdev.sharepoint.com/sites/CHDA/knowledge/Documents/Forms/AllItems.aspx?id=%2Fsites%2FCHDA%2Fknowledge%2FDocuments%2FSPO%20Development%20Decision%20Tree%2Epdf&parent=%2Fsites%2FCHDA%2Fknowledge%2FDocuments

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
                var owaurl = listURL + "/_layouts/15/Doc.aspx?sourcedoc={" + docGUID + "}&file=" + encodeURIComponent(docTitle) + "&action=view";                   
                window.open(owaurl);
            } else {                
                // can not open with office web apps (ex:txt)
                alert('not a supported Office 365 document')
            }
        },
        error: function (data, errorCode, errorMessage) {
        // error
        }
    });
}

function editDoc(list,docName){
    var listURL = siteURL.split("sites/")[0]+"sites/"+siteURL.split("/")[4] + "/knowledge/";
    var relURL = "/"+siteURL.split('/')[3]+"/"+siteURL.split('/')[4]+"/"+siteURL.split('/')[5]+"/"+list+"/"+docName;
    //console.log(listURL+" "+relURL);

    //PDF link
    //https://maximusukdev.sharepoint.com/sites/CHDA/knowledge/Documents/Forms/AllItems.aspx?id=%2Fsites%2FCHDA%2Fknowledge%2FDocuments%2FSPO%20Development%20Decision%20Tree%2Epdf&parent=%2Fsites%2FCHDA%2Fknowledge%2FDocuments

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
                // can not open with office web apps (ex:txt)
                alert('not a supported Office 365 document')
            }
        },
        error: function (data, errorCode, errorMessage) {
        // error
        }
    });
}


function getDocTabs(){
    var inc =0;
    var tabNum =6;
    var docContentString = "";
    var docTabString = "";

    //Current Context
    var context = SP.ClientContext.get_current();
    
    //Current Taxonomy Session
    var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
    
    //Term Stores
    var termStores = taxSession.get_termStores();
    
    //Name of the Term Store from which to get the Terms.
    var termStore = termStores.getByName("Taxonomy_HF+Tg/S5P5zRiGE5lqCPEw==");
    
    //GUID of Term Set from which to get the Terms.
    var termSet = termStore.getTermSet("65bde35b-d397-4de0-b69f-829df04dd9ce"); // *** Knowledge Library
    var parentTerm = termSet.getTerm('1e4b7e55-bfdb-4cb9-af87-fd068f3645b0'); // *** Documents set
    var terms = parentTerm.get_terms();
    
    context.load(terms);
    context.executeQueryAsync(function(){
    
    var termEnumerator = terms.getEnumerator();    
        while(termEnumerator.moveNext()){
            var currentTerm = termEnumerator.get_current();     
            var tabName = currentTerm.get_name();

            if(tabName!=="General" && tabName!=="Quality" && tabName!=="Talent and Development"){
                
                docContentString="<div id='knTab"+tabNum+"' class='tab-pane fade'><div id='"+tabName+"'></div></div>";
                
                switch (tabName){
                    case 'Management':
                        docTabString = "<li class='nav-item' id='mgmtDocs'><a class='nav-link' data-toggle='pill' href='#knTab"+tabNum+"'>"+tabName+"</a></li>";
                        break;
                    case 'Clinical Standards':
                        docTabString = "<li class='nav-item' id='clinicalDocs'><a class='nav-link' data-toggle='pill' href='#knTab"+tabNum+"'>"+tabName+"</a></li>";
                        docContentString="<div id='knTab"+tabNum+"' class='tab-pane fade'><div id='Standards'></div></div>";
                        break;

                    default:
                        docTabString = "<li class='nav-item'><a class='nav-link' data-toggle='pill' href='#knTab"+tabNum+"'>"+tabName+"</a></li>";
                        break;
                }

                $('#docTabs').append(docTabString);
                $('#docContent').append(docContentString);
                inc++;
                tabNum++;
            }
        } 
    },function(sender,args){
        console.log(args.get_message());
    });

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