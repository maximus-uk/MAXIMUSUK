var CAB_ID;

function getListItems() {

    clearPreview();

    var rag;
    var htmlString = "";
    var method = "GetListItems";
    var list = "Change Advisory Board Requests";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title1' />" +
        "<FieldRef Name='SysAid_Ref' />" +
        "<FieldRef Name='CHANGE_x0020_ID' />" +
        "<FieldRef Name='Owner' />" +
        "<FieldRef Name='Change_Status' />" +
        "<FieldRef Name='Total_Outage' />" +
        "<FieldRef Name='CAB_Risk' />" +
        "<FieldRef Name='Submitted' />" +
        "<FieldRef Name='Required_x0020_By' />" +
        "</ViewFields>";
    $('#cabData').empty();

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: "<Query><OrderBy><FieldRef Name='SysAid_Ref'/></OrderBy></Query>",
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var ID = ($(this).attr("ows_ID"));
                var Title = ($(this).attr("ows_Title1"));
                var Ref = ($(this).attr("ows_SysAid_Ref"));
                var Owner = ($(this).attr("ows_Owner"));
                var Status = ($(this).attr("ows_Change_Status"));
                var totalOutage = ($(this).attr("ows_Total_Outage"));
                var Risk = ($(this).attr("ows_CAB_Risk"));
                var submitDate = ($(this).attr("ows_Submitted"));
                var requireDate = ($(this).attr("ows_Required_x0020_By"));

                CAB_ID = ($(this).attr("ows_CHANGE_x0020_ID"));

                var startYYYY = submitDate.substr(0, 4);
                var startMM = submitDate.substr(5, 2);
                var startDD = submitDate.substr(8, 2);
                var submitDate = startDD + '/' + startMM + '/' + startYYYY;

                var endYYYY = requireDate.substr(0, 4);
                var endMM = requireDate.substr(5, 2);
                var endDD = requireDate.substr(8, 2);
                var requireDate = endDD + '/' + endMM + '/' + endYYYY;

                switch (Risk) {
                    case 'Low':
                        rag = "color: lightblue!important";
                        break;
                    case 'Medium':
                        rag = "color: green!important";
                        break;
                    case 'High':
                        rag = "color: yellow!important";
                        break;
                    case 'Very High':
                        rag = "color: red!important";
                        break;
                };

                switch (Status) {
                    case 'In Progress':
                    case 'Complete':
                    case 'Submitted':
                    case 'Approved':
                    case 'Pending':

                        htmlString = '<tr id="' + ID + '" style="border-bottom:1px solid #545487" width="92%" height="50px">' +
                            '<td width="6%" class="greyBorderRight" style="padding:0 -3px 0 -3px">' +
                            '<div class="col-sm-1 col-md-1 col-lg-1">' +
                            '<a href="#" onclick="viewForm(' + CAB_ID + '); return false;" title="View Item"><i class="fa fa-eye"></i></a>' +
                            '</div>' +
                            '<div class="col-sm-1 col-md-1 col-lg-1">' +
                            '<a href="#" onclick="emailApproval(' + CAB_ID + '); return false;" title="Request Approval"><i class="fa fa-envelope"></i></a>' +
                            '</div>' +
                            '<div class="col-sm-1 col-md-1 col-lg-1">' +
                            '<a href="#" onclick="markComplete(' + CAB_ID + '); return false;" title="Complete Item"><i class="fa fa-check"></i></a>' +
                            '</div>' +
                            '</td>' +
                            '<a href="#" onclick="viewForm(' + CAB_ID + '); return false;" class="align-middle">' +
                            '<td width="10%" class="greyBorderRight" style="padding:0 3px 0 3px"><h5><b>' + Ref + '</b></h5></td>' +  //<a href="#" onclick="viewCAB('+ CAB_ID +'); return false;"></a>
                            '<td width="20%" class="greyBorderRight" style="padding:0 3px 0 3px"><p>' + Title + '</p></td>' +
                            '<td width="13%" class="greyBorderRight" style="padding:0 3px 0 3px">' + Owner + '</td>' +
                            '<td width="13%" class="greyBorderRight" style="padding:0 3px 0 3px">' + submitDate + '</td>' +
                            '<td width="13%" class="greyBorderRight" style="padding:0 3px 0 3px">' + requireDate + '</td>' +
                            '<td width="9%" align="center" class="greyBorderRight" style="padding:0 3px 0 3px">' + totalOutage + '</td>' +
                            '<td width="6%" align="center" class="greyBorderRight" style="padding:0 3px 0 3px"><i class="fa fa-circle" style="' + rag + '"></i></td>' +
                            '<td width="8%" align="center" style="font-size:.8em">' + Status + '</td>' +
                            '</a>' +
                            '</tr>';

                        $('#cabData').append(htmlString);
                        break;
                };
            });
        }
    });
};

function clearPreview() {
    $("#previewWindow").attr('src', '#');
};

function viewForm(cabID) {
    $('#previewWindow').attr('src', "https://intranet.chda.maxuk.co.uk/teams/it/_layouts/15/FormServer.aspx?XmlLocation=/teams/it/Change%20Advisory%20Board%20Requests/" + cabID + ".xml&DefaultView=CAB%20Review%201&DefaultItemOpen=2&Width=50%&Source=https%3A%2F%2Fintranet%2Echda%2Emaxuk%2Eco%2Euk%2Fteams%2Fit%2FChange%2520Advisory%2520Board%2520Requests%2FForms%2FAllItems%2Easpx");
    //document.getElementById(id).style.background = "#ddddeb";			

    $('tr').on('click', function () {
        $('tr').removeClass('highlight');
        $(this).addClass('highlight');
    });
};

function loadNew() {
    $('#previewWindow').attr('src', "https://intranet.chda.maxuk.co.uk/teams/it/_layouts/15/FormServer.aspx?XsnLocation=/teams/it/Forms/CHDA%20IT%20Change%20Request%20Form.xsn&ClientInstalled=true&DefaultItemOpen=1&Source=https://intranet.chda.maxuk.co.uk/teams/it/SitePages/CHDA%20IT%20CHANGE%20SCHEDULE.aspx");
    getListItems();
};

function viewCAB(cabID) {
    $('#previewWindow').attr('src', "https://intranet.chda.maxuk.co.uk/teams/it/_layouts/15/FormServer.aspx?XmlLocation=/teams/it/Change%20Advisory%20Board%20Requests/" + cabID + ".xml&ClientInstalled=false&DefaultItemOpen=1&Source=https%3A%2F%2Fintranet%2Echda%2Emaxuk%2Eco%2Euk%2Fteams%2Fit%2FChange%2520Advisory%2520Board%2520Requests%2FForms%2FAllItems%2Easpx");

    $('tr').on('click', function () {
        $('tr').removeClass('highlight');
        $(this).addClass('highlight');
    });
};

function markComplete(cabID) {

    localStorage.setItem("cab_id", cabID);

    $('#previewWindow').attr('src', "https://intranet.chda.maxuk.co.uk/teams/it/SitePages/CAB_Complete.html");

    $('tr').on('click', function () {
        $('tr').removeClass('highlight');
        $(this).addClass('highlight');
    });
};

function emailApproval(cabID) {

    localStorage.setItem("cab_id", cabID);

    $('#previewWindow').attr('src', "https://intranet.chda.maxuk.co.uk/teams/it/SitePages/CAB_Approval.html");

    $('tr').on('click', function () {
        $('tr').removeClass('highlight');
        $(this).addClass('highlight');
    });
};

function sendYes(cabID) {

    var method = "GetListItems";
    var list = "Change Advisory Board Requests";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title1' />" +
        "<FieldRef Name='SysAid_Ref' />" +
        "<FieldRef Name='Owner' />" +
        "<FieldRef Name='Contact_x0020_Email_x0020_Address' />" +
        "<FieldRef Name='Change_Status' />" +
        "</ViewFields>";
    var query = "<Query><Where><Eq><FieldRef Name='CHANGE_x0020_ID'/><Value Type='Text'>" + cabID + "</Value></Eq></Where></Query>";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item     
                var ID = ($(this).attr("ows_ID"));
                var Title = ($(this).attr("ows_Title1"));
                var Ref = ($(this).attr("ows_SysAid_Ref"));
                var Owner = ($(this).attr("ows_Owner"));
                var ownerEmail = ($(this).attr("ows_Contact_x0020_Email_x0020_Address"));
                var Status = ($(this).attr("ows_Change_Status"));
                var cabEmail = "chdaitchange@maximusuk.co.uk";
                var firstName = Owner.split(" ")[0];

                var formattedBody1 = "This is to advise that this change request has been marked as complete by the change owner (" + Owner + "). \nThe change was successful.\n\nThank You.\nSharePoint Team";
                var mailToLink1 = "mailto:" + cabEmail + "?cc=jclark@maximusuk.co.uk&subject=Change Request " + Ref + " - " + Title + " Complete&body=" + encodeURIComponent(formattedBody1);
                document.getElementById('yes1');
                window.location.href = mailToLink1;

                var formattedBody2 = "Dear " + firstName + ", \n\nThank you for marking your change request " + Ref + " as being complete.  The change request team have been notified of this change and the system updated.\nPlease ensure that you have attached your supporting documentation to the change form, to evidence the success of this change.\n\nThank You.\nChange Request Team.";
                var mailToLink2 = "mailto:" + ownerEmail + "?cc=jclark@maximusuk.co.uk&subject=Thank You&body=" + encodeURIComponent(formattedBody2);
                document.getElementById('yes2');
                window.location.href = mailToLink2;

                updateRecord(ID);
            });
        }
    });
};

function sendNo(cabID) {

    var method = "GetListItems";
    var list = "Change Advisory Board Requests";
    var fields = "<ViewFields>" +
        "<FieldRef Name='Title1' />" +
        "<FieldRef Name='SysAid_Ref' />" +
        "<FieldRef Name='Owner' />" +
        "<FieldRef Name='Change_Status' />" +
        "</ViewFields>";
    var query = "<Query><Where><Eq><FieldRef Name='CHANGE_x0020_ID'/><Value Type='Text'>" + cabID + "</Value></Eq></Where></Query>";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var Title = ($(this).attr("ows_Title1"));
                var Ref = ($(this).attr("ows_SysAid_Ref"));
                var Owner = ($(this).attr("ows_Owner"));
                var emailAddr = "chdaitchange@maximusuk.co.uk";
                var Status = ($(this).attr("ows_Change_Status"));

                var reason = document.getElementById('reason').value;
                var formattedBody = "The above Change request has been flagged at completed by the change owner (" + Owner + "). \nThe change was not successful for the following reason; \n\n" + reason;
                var mailToLink = "mailto:" + emailAddr + "?subject=Change Request " + Ref + " - " + Title + " is Complete&body=" + encodeURIComponent(formattedBody);
                document.getElementById('no');
                window.location.href = mailToLink;
            });
        }
    });
};

function updateRecord(id) {

    var method = "UpdateListItems";
    var list = "Change Advisory Board Requests";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        batchCmd: "Update",
        ID: id,
        valuepairs: [["Change_Status", "Completed"]],
        completefunc: function (xData, Status) {
            alert('Change Request Completed');
        }
    });
};
