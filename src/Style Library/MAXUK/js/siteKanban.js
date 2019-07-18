"use strict";
var projects = [];
var features = [];
var checkboxID = "";
//var web;
//var context;
var height = $(window).height();
var width = $(window).width();
var adjHeight = height / 2;
var adjWidth = width / 1.5;

function getColumns() {

    var method = "GetList";
    var list = "projects";
    var ID = 0;

    $().SPServices({
        async: false,
        operation: method,
        listName: list,
        completefunc: function (xData, Status) {

            $(xData.responseXML).find("Field[DisplayName='Column'] CHOICE").each(function () {
                if (ID < 5) {
                    var columnName = $(this).text();
                    column[ID] = columnName;
                    var colID = "#col" + ID + "Title";
                    console.log(colID);
                    if (ID === 0) {
                        $(colID).append("<div id='newTask'></div><h2>" + columnName + "</h2><hr/>");
                    } else {
                        $(colID).append("<h2>" + columnName + "</h2><hr/>");
                    }
                    ID++;
                };
            });
        }
    });
    $('#newProject').append('<a href="#" title="New Project" role="button" class="btn button addNew" onclick="openDialog(\'' + siteURL + '/Lists/Projects/NewProject.aspx\',\'Add New Project\',400,600); return false;"><span class="glyphicon glyphicon-plus"></span></a>');
}

function getProjects() {

    var projects = [];
    var method = "GetList";
    var list = "projects";
    var ID = 0;

    $().SPServices({
        async: false,
        operation: method,
        listName: list,
        completefunc: function (xData, Status) {

            $(xData.responseXML).find("Field[DisplayName='Project'] CHOICE").each(function () {
                projects[ID] = $(this).text();
                ID++;
            });
        }
    });

    projects.sort();
    for (var i = 0; i < projects.length; i++) {
        $("#projectNames").append("<li>" +
            "<a class='btn button projectButton' id='project" + i + "' data-toggle='tab' href='#" + i + "' onclick='getData(\"" + projects[i] + "\");return false;'>" + projects[i] + "</a>" +
            "</li>");
    }
}

function getData(projectName) {

    // Setup Local Variables
    var count = 0;
    var cardID = 0;
    var method = "GetListItems";
    var typeCode = "";
    var typeTitle = "";
    var priorityCSS = "";
    var priorityBG = "";
    var iconCSS = "";
    var taskDate;

    var list = "projects";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Column' />" +
        "<FieldRef Name='Task Status' />" +
        "<FieldRef Name='AssignedTo' />" +
        "<FieldRef Name='DueDate' />" +
        "<FieldRef Name='TaskType' />" +
        "<FieldRef Name='Priority' />" +
        //"<FieldRef Name='Weighting' />" +
        "</ViewFields>";
    var query = "<Query>" +
        "<Where><Eq><FieldRef Name='Project'/><Value Type='Text'>" + projectName + "</Value></Eq></Where>" +
        "<OrderBy><FieldRef Name='Priority' Ascending='True' /><FieldRef Name='DueDate' Ascending='True' /></OrderBy>" + //<FieldRef Name='Weighting' Ascending='True' />
        "</Query>";

    for (var i = 0; i < 5; i++) { $('#col' + i).empty(); }

    $().SPServices({
        operation: method,
        async: false,
        //webURL: siteURL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var ID = $(this).attr("ows_ID");
                var columnName = $(this).attr("ows_Column");
                var status = $(this).attr("ows_Status");
                var priority = $(this).attr("ows_Priority");
                var cardTitle = $(this).attr("ows_Title");
                var assigned = $(this).attr("ows_AssignedTo").split(';#')[1];
                //var wsjf = $(this).attr("ows_Weighting");
                var dueDate = $(this).attr("ows_DueDate");
                var taskType = $(this).attr("ows_TaskType");

                //wsjf = wsjf.split(';#')[1];
                //wsjf = Math.round(wsjf);
                //cards[cardID]=cardTitle;

                if (dueDate !== undefined) {
                    var taskYYYY = dueDate.substr(0, 4);
                    var taskMM = dueDate.substr(5, 2);
                    var taskDD = dueDate.substr(8, 2);
                    var taskTime = dueDate.substr(11, 8);
                    taskDate = taskDD + '/' + taskMM + '/' + taskYYYY;
                } else {
                    taskDate = 'None';
                }

                switch (priority) {
                    case 'High':
                        priorityCSS = "high";
                        priorityBG = "pHigh";
                        break;
                    case 'Normal':
                        priorityCSS = "norm";
                        priorityBG = "pNorm";
                        break;
                    case 'Low':
                        priorityCSS = "low";
                        priorityBG = "pLow";
                        break;
                    default:
                        priorityCSS = "none";
                        priorityBG = "pNone";
                        break;
                }

                if (status === 'Completed') { priorityCSS = "complete"; };
                if (assigned === undefined) { assigned = "Not Assigned" };

                if (taskType === "Bug") {
                    typeCode = '<i class="fa fa-bug"></i>';
                    typeTitle = 'Bug';
                    iconCSS = 'bugIcon';
                } else {
                    typeCode = '<i class="fa fa-list-alt"></i>';
                    typeTitle = taskType; //'User Story';
                    iconCSS = 'storyIcon';
                }

                for (count = 0; count < column.length; count++) {
                    if (column[count] === columnName) {
                        var columnNum = count;
                    }
                }

                var viewWindow = siteURL + '/Lists/Projects/Edit.aspx?ID=' + ID;

                var cardString =
                    '<li id="' + ID + '" class="kanban ' + priorityCSS + '" title="Click to Edit" onclick="window.open(\'' + viewWindow + '\',\'Edit Card\',\'resizable=no,titlebar=no,toolbar=no,directories=no,location=no,menubar=no,status=no,scrollbars=no,top=100,left=100,height=' + height + ',width=1024\')">' +
                    //'<li id="' + ID + '" class="kanban ' + priorityCSS + '" title="Click to Edit" onclick="loadCard(\'' + viewWindow + '\')">' +
                    '<p id="pCode' + ID + '" hidden>' + priority + '</p>' +
                    '<div class="row rowAdjust ' + priorityBG + '"><h4>' + cardTitle + '</h4></div>' +
                    '<div class="row rowAdjust">' +
                    '<h5 class="col-sm-4 col-md-4 col-lg-4 subLeft15" title="Due Date">' + taskDate + '</h5>' +
                    '<h5 class="col-sm-8 col-md-8 col-lg-8 text-right addLeft10" id="cardStatus' + ID + '" title="Task Status">' + status + '</h5>' +
                    '</div>' +
                    '<div class="row rowAdjust">' +
                    '<div class="col-sm-10 col-md-10 col-lg-10" style="margin:-5px 0 0 -15px"><h6 title="Assigned To">' + assigned + '</h6></div>' +
                    '<div class="col-sm-1 col-md-1 col-lg-1"><h5 title="' + typeTitle + '" class="' + iconCSS + '">' + typeCode + '</h5></div>' +
                    '</div>' +
                    '</li>';

                $('#col' + columnNum).append(cardString);
            });
        }
    });

    $('#projectNames li a').click(function () {
        var projectID = $(this).attr('id');
        var projectTitle = document.getElementById(projectID).innerHTML;
        $('#newTask').html("");
        $('#newTask').append('<a href="#" title="New Task / Card" role="button" class="btn button addNew" onclick="openDialog(\'' + siteURL + '/Lists/Projects/New.aspx?project=' + projectTitle + '\',\'' + projectTitle + '\',' + adjHeight + ',1024); return false;"><span class="glyphicon glyphicon-plus"></span></a>');
    });
}

function loadCard(url) {
    $("#kCard").load(url).dialog({
        modal: true,
        width: "1024px",
        height: "980px"
    });
}

function updateCard(id, column, priority, CSS) {

    var method = "UpdateListItems";
    var list = 'projects';
    var columnName = "";
    var statusName = "";

    switch (column) {
        case 'col0':
            columnName = "New";
            statusName = "Not Started";
            $('#' + id).removeClass(CSS);
            $('#' + id).addClass(priority);
            break;
        case 'col1':
            columnName = "Requirements";
            statusName = "In Progress";
            $('#' + id).removeClass(CSS);
            $('#' + id).addClass(priority);
            break;
        case 'col2':
            columnName = "In Progress";
            statusName = "In Progress";
            $('#' + id).removeClass(CSS);
            $('#' + id).addClass(priority);
            break;
        case 'col3':
            columnName = "Testing";
            statusName = "Testing";
            $('#' + id).removeClass(CSS);
            $('#' + id).addClass(priority);
            break;
        case 'col4':
            columnName = "Complete";
            statusName = "Completed";
            $('#' + id).removeClass(priority);
            $('#' + id).addClass('complete');
            break;
        default:
            columnName = "New";
            statusName = "Not Started";
            break;
    }

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        batchCmd: "Update",
        ID: id,
        valuepairs: [["Column", columnName], ["Status", statusName]],
        completefunc: function (xData, Status) {
            $('#cardStatus' + id).text(statusName);
        }
    });
}

function loadComments(URL, projectName, cardName, cardID) {

    $('#cardComments').html("");

    var count = 0;
    var commentID = 0;
    var commentFilePath = "";
    var method = "GetListItems";
    var list = "Comments";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='cardID' />" +
        "<FieldRef Name='Body' />" +
        "<FieldRef Name='Project' />" +
        "<FieldRef Name='Created' />" +
        "<FieldRef Name='Author' />" +
        "<FieldRef Name='FileRef' />" +
        "</ViewFields>";
    var query = "<Query>" +
        "<Where>" +
        "<Eq><FieldRef Name='cardID'/><Value Type='Number'>" + cardID + "</Value></Eq>" +
        "</Where>" +
        "</Query>";

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
                commentID = $(this).attr("ows_ID");
                commentFilePath = $(this).attr("ows_FileRef");

                var commentProject = $(this).attr("ows_Project");
                var commentCard = $(this).attr("ows_Title");
                var commentBody = $(this).attr("ows_Body");
                var commentDate = $(this).attr("ows_Created");
                var commentBy = $(this).attr("ows_Author");

                // ***** reformat start & end date in normalised format *****
                var commentYYYY = commentDate.substr(0, 4);
                var commentMM = commentDate.substr(5, 2);
                var commentDD = commentDate.substr(8, 2);
                var commentTime = commentDate.substr(11, 8);
                commentDate = commentDD + '/' + commentMM + '/' + commentYYYY;

                commentBy = commentBy.split(';#')[1];
                commentFilePath = commentFilePath.split(';#')[1];

                var commentString = "<div class='row addLeft20 rowDivider'>" +
                    "<h4 style='color:#545487'>" + commentBy + " " + commentDate + " @ " + commentTime + "</h4>" +
                    "<span style='color:#666!important;font-size:.9em!important'>" + commentBody + "</span>" +
                    "</div>";

                $('#cardComments').append(commentString);
                count++;
            });
        }
    });

    if (commentID === 0) {
        // **** run newComment code to add kanban card title and project to comments list
        // **** then display the blank form to add a comment				
        var commentString = "<div class='row addLeft10 rowDivider'>" +
            "<div class='replyContainer form-group'>" +
            "<textarea class='expand form-control' rows='1' cols='50' id='commentText' placeholder='enter your message...'></textarea>" +
            "<button type='button' id='addNew' class='btn btn-default replyPostBtn alignRight savechanges' data-dismiss='modal' data-id='add' onclick='newComment(\"" + cardName + "\",\"" + projectName + "\",\"" + cardID + "\");return false;'>Add</a>" +
            "</div>" +
            "</div>";

        $('#cardComments').append(commentString);
    }

    if (count > 0) {
        $('#cardPost').html("");

        var commentPost = "<div class='replyContainer addLeft20 form-group' style='margin-top:10px'>" +
            "<textarea class='expand form-control' rows='1' cols='50' id='commentText' placeholder='enter your message...'></textarea>" +
            "<button type='button' id='addNew' class='btn btn-default replyPostBtn alignRight savechanges' data-dismiss='modal' data-id='add' onclick='newComment(\"" + cardName + "\",\"" + projectName + "\",\"" + cardID + "\");return false;'>Add</a>" +
            "</div>";
        $('#cardPost').append(commentPost);
    }
}

function newComment(cardName, project, cardID) {

    var siteURL = _spPageContextInfo.webAbsoluteUrl; //document.location.href;
    var method = "UpdateListItems";
    var list = "Comments";
    var comment = document.getElementById("commentText").value;

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        batchCmd: "New",
        valuepairs: [["Title", cardName], ["Project", project], ["cardID", cardID], ["Body", comment]],
        completefunc: function (xData, Status) {
            loadComments(siteURL, project, cardName, cardID);
            //location.reload(true);
        }
    });
}

function loadDocuments(URL, project) {

    // Setup Local Variables
    var pdfIcon = '<i class="fa fa-file-pdf-o redIcon" aria-hidden="true"></i>';
    var wordIcon = '<i class="fa fa-file-word-o blueIcon" aria-hidden="true"></i>';
    var xlIcon = '<i class="fa fa-file-excel-o greenIcon" aria-hidden="true"></i>';
    var ppIcon = '<i class="fa fa-file-powerpoint-o orangeIcon" aria-hidden="true"></i>';
    var docIcon = '<i class="fa fa-file-o" aria-hidden="true"></i>';
    var icon;
    var docID = 0;
    var docFlag = false;

    // SP Services Variables
    var list = "Documents";
    var method = "GetListItems";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='LinkFilenameNoMenu' />" +
        "<FieldRef Name='Project' />" +
        "<FieldRef Name='Created' />" +
        "</ViewFields>";
    var query = "<Query>" +
        "<Where>" +
        "<Eq><FieldRef Name='Project'/><Value Type='Text'>" + project + "</Value></Eq>" +
        "</Where>" +
        "</Query>";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,

        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var ID = $(this).attr("ows_ID");
                var docName = $(this).attr("ows_LinkFilenameNoMenu");
                var docTitle = $(this).attr("ows_LinkFilenameNoMenu").split(".")[0];
                var docType = $(this).attr("ows_LinkFilenameNoMenu").split(".")[1];
                var docFQN = URL + '/Documents/' + docName;

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
                    default:
                        icon = docIcon;
                        break;
                }

                var documentString = '<div class="row" style="margin-left:25px!important">' +
                    '<p class="docItem"><a style="color:black!important" href="' + docFQN + '" title="open document">' + docTitle + '</a></p>' +
                    '</div>';

                $('#projectDocs').append(documentString);
                docFlag = true;
            });
        }
    });
    if (docFlag === false) {
        $("#projectDocs").append('There are no project documents to display.');
    }
}

function getFeatureFields(isNew, project, card, cardID, mode) {

    //var web = context.get_web();    

    var featureField = "";
    var list = web.get_lists().getByTitle('Projects');
    var view = list.get_views().getByTitle('All');
    var listFields = view.get_viewFields();

    context.load(listFields, 'Include(Title)');
    context.executeQueryAsync(checkFields, onError);

    function checkFields() {

        var fldArray = [];
        var featureNum = 1;
        var numFeatures = 0;
        var listInfo = '';
        var listEnumerator = listFields.getEnumerator();

        while (listEnumerator.moveNext()) {
            var fieldName = listEnumerator.get_current();
            var fName = fieldName.toString().substr(0, 7);
            if (fName === "Feature") {
                console.log(fieldName);

                // *** check if feature field has data
                /*
                $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('projects')/Fields/GetByTitle('"+fieldName+"')",
                    type: "GET",
                    headers: {
                        "accept": "application/json;odata=verbose",
                    },
                    success: function (data) {
                        console.log(data.d.results);
                    },
                    error: function (error) {
                        console.log(JSON.stringify(error));
                    }
                });
                */
                fldArray.push(fieldName);
            }
        }

        numFeatures = fldArray.length;

        if (isNew) {
            if (numFeatures > 0) {
                for (var i = 1; i < numFeatures; i++) {
                    var temp = fldArray[i - 1].substr(0, 11);
                    if (temp === "Feature" + i) {
                        featureNum++;
                    }
                }
                featureNum += 1;
            }
            featureField = "Feature" + featureNum;
            getFeatureData(isNew, project, card, featureField, featureNum, cardID);

            // ***** Create Feature Text Field
            createTextField(featureField);

            // ***** Create Feature Checkbox Field
            //createBoolField(featureField);
        } else {
            for (var x = 0; x < numFeatures; x++) {
                getFeatureData(isNew, project, card, fldArray[x], x + 1, cardID);
            }
        }
    }

    function onError(sender, args) { console.log(args.get_message()); };
}

function getFeatureData(isNew, projectName, cardName, featureField, featureCount, cardID) {

    // Setup Local Variables       
    var method = "GetListItems";
    var list = "projects";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Project' />" +
        "<FieldRef Name='" + featureField + "' />" +
        "</ViewFields>";
    var query = "<Query>" +
        "<Where>" +
        "<Eq><FieldRef Name='Project'/><Value Type='Text'>" + projectName + "</Value></Eq>" +
        "</Where>" +
        "</Query>";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var chkFlag = "";
                var featureString = "";
                var ID = $(this).attr("ows_ID");
                var feature = $(this).attr("ows_" + featureField);
                var card = $(this).attr("ows_Title");

                if (ID === cardID) {
                    if (card === cardName) {
                        if (feature !== undefined) {

                            var check = feature.split('-')[1];
                            var featureID = projectName + ";" + cardName + ";" + featureCount + ";" + featureField;

                            if (check === '1') { chkFlag = 'checked'; } else { check = '0'; chkFlag = '' };
                            feature = feature.split('-')[0];
                            featureString = '<div class="row" style="margin-top:5px">' +
                                '<div class="col-sm-1 col-md-1 col-lg-1">' +
                                '<a title="Remove this Feature" id="featureClear' + featureCount + '" onclick="removeFeature(\'' + featureField + '\',\'' + cardID + '\',\'' + featureCount + '\',\'' + featureID + '\');return false;" role="button" ><span class="glyphicon glyphicon-remove"></span></a>' +
                                '</div>' +
                                '<div class="col-sm-1 col-md-1 col-lg-1 text-center featureChk"><input type="checkbox" name="box' + featureCount + '" id="' + featureID + '" ' + chkFlag + '/></div>' +
                                '<div class="col-sm-1 col-md-1 col-lg-1 text-left" style="left:-35px;top:2px"><a href="#" id="featureEdit' + featureCount + '" onclick="editFeature(\'' + featureCount + '\');return false;"><span class="glyphicon glyphicon-pencil"></span></a></div>' +
                                '<div class="col-sm-8 col-md-8 col-lg-8 text-left featureTxt" style="top:-5px;left:-55px!important" id="featureTxt' + featureCount + '"><h5>' + feature + '</h5></div>' +
                                '<div class="col-sm-9 col-md-9 col-lg-9 text-left featureTxt hidden" id="featureInput' + featureCount + '"><input type="text" size="105" style="font-size:14px" id="' + featureField + '" name="' + featureField + '" value="' + feature + '" onchange="updateFeature(\'' + featureField + '\',\'' + cardID + '\');return false;" placeholder="Enter your text..."></input></div>' +
                                '<div class="col-sm-9 col-md-9 col-lg-9 text-left featureTxt hidden" id="featureNew' + featureCount + '"><input type="text" size="105" style="font-size:14px" id="' + featureField + '" name="' + featureField + '" onchange="updateFeature(\'' + featureField + '\',\'' + cardID + '\');return false;" placeholder="Enter your text..."></input></div>' +
                                '</div>';
                        } else {
                            featureString = '<div class="row" style="margin-top:5px">' +
                                '<a href="#" role="button" class="disabled col-sm-1 col-md-1 col-lg-1" style="cursor:default;color:#666"><span class="glyphicon glyphicon-remove"></span></a>' +
                                '<div class="col-sm-1 col-md-1 col-lg-1 text-center featureChk"><input class="disabled" type="checkbox" disabled name="box' + featureCount + '" id="' + featureID + '"/></div>' +
                                '<div class="col-sm-9 col-md-9 col-lg-9 text-left featureTxt" id="featureInput' + featureCount + '"><input type="text" size="105" style="font-size:14px" id="' + featureField + '" name="' + featureField + '" onchange="updateFeature(\'' + featureField + '\',\'' + cardID + '\');return false;" placeholder="Enter your text..."></input></div>' +
                                '</div>';
                        };
                        if (isNew) {
                            featureString = '<div class="row" style="margin-top:5px">' +
                                '<a href="#" role="button" class="col-sm-1 col-md-1 col-lg-1 disabled" style="cursor:default;color:#666"><span class="glyphicon glyphicon-remove"></span></a>' +
                                '<div class="col-sm-1 col-md-1 col-lg-1 text-center featureChk"><input class="disabled" type="checkbox" disabled name="box' + featureCount + '" id="' + featureID + '"/></div>' +
                                '<div class="col-sm-9 col-md-9 col-lg-9 text-left featureTxt" id="featureInput' + featureCount + '"><input type="text" size="105" style="font-size:14px" id="' + featureField + '" name="' + featureField + '" onchange="updateFeature(\'' + featureField + '\',\'' + cardID + '\');return false;" placeholder="Enter your text..."></input></div>' +
                                '</div>';
                        }
                        // featureCount++;
                    }
                }
                if (featureString !== "") {
                    $('#featureItem').append(featureString);
                }
            });
        }
    });
    if (featureCount > 0) { $('#progressBar').removeClass('hidden'); };
}

//This creates a new feature field based on previous function results   
function createTextField(fieldName) {
    var list = context.get_web().get_lists().getByTitle('Projects');
    var newField = list.get_fields().addFieldAsXml('<Field DisplayName=\'' + fieldName + '\' Type=\'Text\' />', true, SP.AddFieldOptions.defaultValue);
    newField.update();
    //context.load(newField, 'Include(Title)');
    context.executeQueryAsync(function () {
        console.log("Created fields:/n" + fieldName.toString());
    }, function (sender, args) {
        console.log("Error:\n" + arg.get_message());
    });
}

function removeFeature(fieldName, cardID, fieldID, featureID) {
    var method = "UpdateListItems";
    var list = "projects";
    var featureTxt = "";
    var checkboxID = "#" + featureID + ":checkbox:checked";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        ID: cardID,
        batchCmd: "Update",
        valuepairs: [["" + fieldName + "", featureTxt]],
        completefunc: function (xData, Status) {
            $('#featureTxt' + fieldID).addClass('hidden');
            $('#featureEdit' + fieldID).addClass('hidden');
            $('#featureNew' + fieldID).removeClass('hidden');

            //if (xData.status == 200) { console.log(fieldName + " updated with " + featureTxt); };
        }
    });
}

function updateFeature(fieldName, cardID) {

    var method = "UpdateListItems";
    var list = "projects";
    var featureTxt = document.getElementById(fieldName).value;

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        ID: cardID,
        batchCmd: "Update",
        valuepairs: [["" + fieldName + "", featureTxt]],
        completefunc: function (xData, Status) {
            $('#' + fieldName).css({ 'background-color': 'green', 'color': 'white' });

            //$('#'+fieldName).append("<span class='glyphicon glyphicon-ok' style='color:green'></span>");
            //if (xData.status == 200) { console.log(fieldName + " updated with " + featureTxt); };          
        }
    });
}

function editFeature(fieldID) {
    //var featureTxt = document.getElementById('#featureTxt'+fieldID).value;
    $('#featureTxt' + fieldID).addClass('hidden');
    $('#featureEdit' + fieldID).addClass('hidden');
    $('#featureInput' + fieldID).removeClass('hidden');
}

function countBoxes() {
    var boxes = $('input:checkbox').length;
    numBoxes = 0;
    for (var i = 1; i <= boxes; i++) {
        var featureVal = $('#featureTxt' + i).val();
        if (featureVal !== undefined) {
            numBoxes++;
        }
    }
    //numBoxes = $('input:checkbox').length;
}

function countChecked() {

    numChecked = $("input:checkbox:checked").length;
    console.log(numChecked);

    //*** mark feature item as complete on page
    $(":checkbox:checked").each(function () {
        var fieldID = this.id;
        if (fieldID !== undefined) {
            var itemID = fieldID.split(';')[2];
            var featureTxtID = "#featureTxt" + itemID;
            $(featureTxtID).addClass('checkedItem');
            $("#featureClear" + itemID).addClass('hidden');
            $("#featureEdit" + itemID).addClass('hidden');
        };
    });

    var percentage = parseInt(((numChecked / numBoxes) * 100), 10);
    //if (isNan(percentage)) { percentage = 0; };
    //alert(percentage);
    $(".progressbar-bar").progressbar({ value: percentage });
    $(".progressbar-label").text(percentage + "%");
}

function writeChecked(fieldID, chkFlag) {

    var projectName = fieldID.split(';')[0];
    var cardName = fieldID.split(';')[1];
    var itemID = fieldID.split(';')[2];
    var fieldName = fieldID.split(';')[3];
    var data = "";

    var method = "GetListItems";
    var list = "projects";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Project' />" +
        "<FieldRef Name='" + fieldName + "' />" +
        "</ViewFields>";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var ID = $(this).attr("ows_ID");
                var feature = $(this).attr("ows_" + fieldName);
                var project = $(this).attr("ows_Project");
                var card = $(this).attr("ows_Title");

                if (project === projectName) {
                    if (card === cardName) {
                        if (feature !== undefined) {

                            var featureTxtID = "#featureTxt" + itemID;

                            feature = feature.split('-')[0];

                            if (chkFlag) {
                                data = feature + "-1";
                                $(featureTxtID).addClass('checkedItem');
                                $("#featureClear" + itemID).addClass('hidden');
                                $("#featureEdit" + itemID).addClass('hidden');
                            } else {
                                data = feature + "-0";
                                $(featureTxtID).removeClass('checkedItem');
                                $('#featureClear' + itemID).removeClass('hidden');
                                $('#featureEdit' + itemID).removeClass('hidden');
                            }
                            updateChecked(ID, fieldName, data);
                        }
                    }
                }
            });
        }
    });
}

function updateChecked(ID, fieldName, data) {
    var list = "projects";

    $().SPServices({
        operation: "UpdateListItems",
        async: false,
        listName: list,
        batchCmd: "Update",
        ID: ID,
        valuepairs: [[fieldName, data]],
        completefunc: function (xData, Status) {
            console.log('Field Updated :' + fieldName + " - " + data);
        }
    });
}

function showDialog(URL, ID, project) {

    $("#dialog-modal")
        .html('<iframe style="border:0px" src="' + URL + '" width="1024px" height="1024px"></iframe>')
        .dialog({
            autoOpen: false,
            height: 1024,
            width: 1024,
            modal: true
        });

    $('#dialog-modal').dialog("open");

    //window.open("" + URL + "",,"titlebar=no,toolbar=no,location=no,menubar=no,status=no,scrollbars=no,top=100,left=100,height=1024,width=1024");

    /*var $dialog = $('#' + ID)
        .html('<iframe style="border:0px" src="' + URL + '" width="1024px" height="1024px"></iframe>')
        .dialog({
            title: project,
            autoOpen: false,
            //dialogClass: 'dialog_fixed,ui-widget-header',
            modal: true,
            height: 1024,
            draggable: true,
            buttons: { "Ok": function () { $(this).dialog("close"); parent.loction.reload; } }
        });
    $dialog.dialog('open');*/
}

function popup(url) {
    console.log(url);
    //var newwindow = 
    window.open(url, '_blank', 'height=1024,width=1024,toolbars=No,titlebar=No,location=No');

    //window.open(\''+viewWindow+'\',\'\',\'titlebar=no,toolbar=no,location=no,menubar=no,status=no,scrollbars=no,top=100,left=100,height=1024,width=1024\')">' +

    //if (window.focus) { newwindow.focus() }
    //return false;
}

function makeActive(tabNum) {
    $('#kanbanCardTabs li').removeClass('active');
    $("#kanbanCardTabs li:nth-child(" + tabNum + ")").addClass('active');
}

/*
function createColumns_click(listTitle, fieldTitle) {
    var myCtx = SP.ClientContext.get_current();
    var myList = myCtx.get_web().get_lists().getByTitle(listTitle);
    var newField = myList.get_fields().addFieldAsXml("<Field DisplayName=\'" + fieldTitle + "\' Type=\'Text\' />", true, SP.AddFieldOptions.defaultValue);
    newField.update();
    myCtx.executeQueryAsync(function(){
        alert("Field <" + fieldTitle + "> created!");
    }, function(sender, args){
        alert("Error:\n" + args.get_message());
    });
}

$(function() {
    $("#btn_createField").click(function() {
        var listName = $("#in_listName").val();
        var fieldName = $("#in_fieldName").val();
        createColumns_click(listName, fieldName);
    });
});
*/