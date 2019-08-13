function getFiles(URL, listName, list) {

    var pdfIcon = '<i class="fa fa-file-pdf-o redIcon" aria-hidden="true"></i>';
    var wordIcon = '<i class="fa fa-file-word-o blueIcon" aria-hidden="true"></i>';
    var xlIcon = '<i class="fa fa-file-excel-o greenIcon" aria-hidden="true"></i>';
    var ppIcon = '<i class="fa fa-file-powerpoint-o orangeIcon" aria-hidden="true"></i>';
    var docIcon = '<i class="fa fa-file-o" aria-hidden="true"></i>';
    var icon;
    var folderSection = "";
    var ID = 1;
    var docID = 0;
    var listFolder = "";
    var folderNamePrev = "";
    var docFlag = false;
    var viewerPath = '';

    // SP Services Variables
    var method = "GetListItems";
    var fields = "<ViewFields>" +
        "<FieldRed Name='ID' />" +
        "<FieldRef Name='Folder' />" +
        //"<FieldRef Name='Sub_x002d_Folder' />" +
        "<FieldRef Name='LinkFilenameNoMenu' />" +
        "<FieldRef Name='DocumentName' />" +
        "</ViewFields>";
    var query = '<Query><OrderBy><FieldRef Name="Folder" Ascending="TRUE" /><FieldRef Name="DocumentName" Ascending="TRUE" /></OrderBy></Query>'; //<FieldRef Name="Sub_x002d_Folder" Ascending="TRUE" />

    $().SPServices({
        operation: method,
        async: false,
        webURL: URL,
        listName: listName,
        CAMLQuery: query,
        CAMLViewFields: fields,

        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var docID = ($(this).attr("ows_ID"));
                var docFolder = ($(this).attr("ows_Folder"));
                //var docSubFolder = ($(this).attr("ows_Sub_x002d_Folder"));
                var docTitle = ($(this).attr("ows_DocumentName"));
                var docName = ($(this).attr("ows_LinkFilenameNoMenu"));
                var docType = ($(this).attr("ows_LinkFilenameNoMenu").split(".")[1]);
                var folderName = docFolder.split(';#')[1];
                var subFolderName = "";
                var docFQN = URL + '/' + list + '/' + docName;

                //alert(docType);																	                

                switch (docType) {
                    case 'pdf':
                    case 'PDF':
                        icon = pdfIcon;
                        viewerPath = docFQN;
                        break;
                    case 'doc':
                    case 'docx':
                        icon = wordIcon;
                        viewerPath = docFQN;
                        break;
                    case 'xls':
                    case 'xlsx':
                    case 'xlsm':
                        icon = xlIcon;
                        viewerPath = 'https://intranet.chda.maxuk.co.uk/teams/it/_layouts/15/xlviewer.aspx?id=' + docFQN + '&Source=' + URL + '/' + list + '/Forms%2FAllItems%2Easpx';
                        break;
                    case 'ppt':
                    case 'pptx':
                    case 'ppsm':
                        icon = ppIcon;
                        viewerPath = docFQN;
                        break;
                    case 'xsn':
                        icon = docIcon;
                        viewerPath = formURL;
                        break;
                    default:
                        icon = docIcon;
                        viewerPath = docFQN;
                        break;
                };

                // ***** if sub folder is defined, add to folder name *****
                /*if (docSubFolder != undefined) {
                    if (docSubFolder.length > 0) {
                        subFolderName = docSubFolder.split(';#')[1];
                        folderName = folderName + " - " + subFolderName;
                    };
                };*/

                if (folderName === folderNamePrev) {
                    //docID = ID - 1;
                    //alert(folderName);
                    var documentString = '<div class="row">' +
                        '<div class="col-sm-1 col-md-1 col-lg-1 docIcon">' + icon + '</div>' +
                        //'<div class="col-sm-1 col-md-1 col-lg-1 text-left subLeft5"><a href="#" onclick="openDialog(\''+URL+'/'+list+'/Forms/Display.aspx?ID='+docID+'\',\'File Properties\',500,680); return false;" title="document information"><i class="fa fa-info" aria-hidden="true"></i></a></div>' +
                        //"<div class='col-sm-1 col-md-1 col-lg-1 text-left subLeft15'><a href='#' onclick='viewDoc(\""+ viewerPath +"\",\""+docType+"\");return false;' title='view document'><i class='fa fa-eye'></i></a></div>" +
                        '<div class="col-sm-10 col-md-10 col-lg-10 text-left">' +
                        '<p class="docItem"><a href="' + docFQN + '" title="open document">' + docTitle + '</a></p>' +
                        '</div>' +
                        '</div>';
                    $('#' + listFolder + 'Doc').append(documentString);
                };

                if (folderName != folderNamePrev) {
                    //alert(folderName);
                    docFlag = true;
                    listFolder = "docFolder" + ID;
                    var folderString = '<div class="panel documentFolder">' +
                        '<a data-toggle="collapse" data-parent="#docFolders" href="#' + listFolder + '" style="text-decoration:none">' +
                        '<div class="panel-heading">' +
                        '<div class="panel-title">' +
                        '<h5 class="folderTitle"><span class="glyphicon glyphicon-folder-close" style="padding-right:10px"></span>' + folderName + '</h5>' +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '<div id="' + listFolder + '" class="panel-collapse collapse docList">' +
                        '<div class="list-group" id="' + listFolder + 'Doc">' +
                        '<div class="row firstRow">' +
                        '<div class="col-sm-1 col-md-1 col-lg-1 docIcon">' + icon + '</div>' +

                        //'<div class="col-sm-1 col-md-1 col-lg-1 text-left subLeft5"><a href="#" onclick="openDialog(\''+URL+'/'+list+'/Forms/Display.aspx?ID='+docID+'\',\'File Properties\',500,680); return false;" title="document information"><i class="fa fa-info" aria-hidden="true"></i></a></div>' +
                        //"<div class='col-sm-1 col-md-1 col-lg-1 text-left subLeft15'><a href='#' onclick='viewDoc(\""+ viewerPath +"\",\""+docType+"\");return false;' title='view document'><i class='fa fa-eye'></i></a></div>" +

                        '<div class="col-sm-10 col-md-10 col-lg-10 text-left">' +
                        '<p class="docItem"><a href="' + docFQN + '" title="open document">' + docTitle + '</a></p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    switch (folderName) {
                        case "Monthly Awards":
                            $('#docMonthSection').append(folderString);
                            break;
                        case "Quarterly Awards":
                            $('#docQuarterSection').append(folderString);
                            break;
                        case "Annual Awards":
                            $('#docYearSection').append(folderString);
                            break;
                        default:
                            $('#docSection').append(folderString);
                            break;
                    };
                    ID++;
                };
                folderNamePrev = folderName;
            });
        }
    });
    if (docFlag === false) {
        $("#docFolders").append('There are no items to display.');
    };
};

/*function viewDoc(docURL,docType) {

	$('#viewer').empty();

    switch (docType) {
        case 'pdf':
        case 'PDF':
            $('#viewer').append("<object style='z-index:1!important'><embed src='"+docURL+"' type='application/pdf'></embed></object>");                 
            break;
        case 'doc':
        case 'docx':
            $('#viewer').append('<iframe src="http://docs.google.com/gview?url='+ docURL +'&embedded=true"></iframe>');
            break;
        case 'ppt':
        case 'pptx':
        case 'ppsm':
            $('#viewer').append("<object style='z-index:1!important'><embed src='"+docURL+"' type='application/vnd.ms-powerpoint'></embed></object>");
            break;
        case 'xls':
        case 'xlsx':
        case 'xlsm':
        case 'xsn':
        	$('#viewer').append("<iframe id='docPreview' name='docPreview' src='"+docURL+"' width='100%' height='100%' scrolling='auto' frameborder='0' onload='resizeIframe(this)'></iframe>");			
			break;	
        default:
            type='text';
            break;
    };	
}

function clearViewer(){$('#viewer').empty();showMessage()}

function showMessage() {
	$('#viewer').append("<h3>Viewer Information</h3>" +
							"<p>Please note: This viewer currently does not support Word and PowerPoint documents.<br/>This is due to the installation limitations of the SharePoint Server.</p>" +
							"<br/>" +
							"<h4>We hope to have this fixed for 2018</h4>");		
};*/