var changeTab = [];
var changeTabNum = [];

function getChangeTabs(siteURL) {

    var method = "GetList";
    var list = "Change_Alerts";
    var ID = 0;
    var url = siteURL + "/";

    $().SPServices({
        async: false,
        operation: method,
        webURL: siteURL,
        listName: list,
        completefunc: function (xData, Status) {

            $(xData.responseXML).find("Field[DisplayName='ChangeType'] CHOICE").each(function () {
                changeTab[ID] = $(this).text();
                changeTabNum[ID] = ID;
                ID++;
            });
        }
    });

    //changeTab.sort();

    if (changeTab.length === 0) {
        $("#changeTabs").append('There currently are no change alerts to display');
    } else {
        for (var i = 0; i < changeTab.length; i++) {

            if (i === 0) {
                $("#changeTabs").append(
                    "<a class='nav-link active show' data-toggle='tab' href='#chgtab0' role='tab'>" + changeTab[i] + "</a>");
                    //"<li class='nav-item'>" +"</li>");
                $("#changeContent").append("<div id='chgtab0' class='tab-pane fade active show' role='tabpanel'>" +
                    "<div class='row' style='margin-bottom: 10px;' id='change0'>" +
                    "<div id='chg0' class='card'>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }

            if (i >= 1) {
                //var x = i - 1;
                $("#changeTabs").append(
                    "<a class='nav-link' data-toggle='tab' href='#chgtab" + i + "' role='tab'>" + changeTab[i] + "</a>" );
                    //"<li class='nav-item'>" +"</li>");
                $("#changeContent").append("<div id='chgtab" + i + "' class='tab-pane fade' role='tabpanel'>" +
                    "<div class='row' style='margin-bottom: 10px;margin-right:10px;' id='change" + i + "'>" +
                    "<div id='chg" + i + "' class='card'>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }
        }
    }
}

function getChangeAlerts(siteURL) {
    
    var method = "GetListItems";
    var list = "Change_Alerts";
    var url = siteURL + "/";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldREf Name='RAG_Status' />" +
        "<FieldRef Name='Contract' />" +
        "<FieldRef Name='Team' />" +
        "<FieldRef Name='StartDate' />" +
        "<FieldRef Name='EndDate' />" +
        "<FieldRef Name='ChangeType' />" +
        "<FieldRef Name='AlertNumber' />" +
        "<FieldRef Name='Creator' />" +
        "<FieldRef Name='Detail' />" +
        "</ViewFields>";

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0
    var yyyy = today.getFullYear();
    if (dd < 10) {dd = '0' + dd;}
    if (mm < 10) {mm = '0' + mm;}
    var dateToday = mm + '/' + dd + '/' + yyyy;

    for (count = 0; count < changeTab.length; count++) {
        var fCount = 1;
        var itemContractPrev = "";
        var RAGColour = '';
        var count;
        var contractsArray = [];
        var listFolder = "";

        $().SPServices({
            operation: method,
            async: false,
            webURL: siteURL,
            listName: list,
            CAMLViewFields: fields,
            completefunc: function (xData, Status) {
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                    var itemID = $(this).attr("ows_ID");
                    var itemContract = $(this).attr("ows_Contract");
                    var itemChange = $(this).attr("ows_ChangeType");
                    var itemTitle = $(this).attr("ows_Title");
                    var itemTeam = $(this).attr("ows_Team").split(';#')[1];
                    var itemRAG = $(this).attr("ows_RAG_Status");
                    var itemDetail = $(this).attr("ows_Detail");
                    var itemAlertNum = $(this).attr("ows_AlertNumber");
                    var itemCreator = $(this).attr("ows_Creator").split(';#')[1];
                    
                    //alert('item '+itemID);

                    var itemStart = $(this).attr("ows_StartDate");
                    //itemStart = itemStart.split(';#')[1];
                    var itemStartYYYY = itemStart.substr(0, 4);
                    var itemStartDD = itemStart.substr(8, 2);
                    var itemStartMM = itemStart.substr(5, 2);
                    itemStart = itemStartMM + '/' + itemStartDD + '/' + itemStartYYYY;

                    var itemEnd = $(this).attr("ows_EndDate");
                    itemEnd = itemEnd.split(';#')[1];
                    var itemEndYYYY = itemEnd.substr(0, 4);
                    var itemEndDD = itemEnd.substr(8, 2);
                    var itemEndMM = itemEnd.substr(5, 2);
                    itemEnd = itemEndMM + '/' + itemEndDD + '/' + itemEndYYYY;

                    switch (itemRAG) {
                        case 'High':
                            RAGColour = 'red';
                            break;
                        case 'Medium':
                            RAGColour = 'yellow';
                            break;
                        case 'Low':
                            RAGColour = 'green';
                            break;
                    }

                    var contractString = "";

                    // ***** split contracts string into seperate items and assign to array slots *****
                    if(itemContract !== undefined){contractsArray=itemContract.split(';#')};

                    // cycle through array items for contacts
                    for (inc = 1; inc < contractsArray.length; inc ++) {
                        if(contractsArray[inc]!==""){contractString+=contractsArray[inc]+", ";}
                    }

                    var msgString = "<tr>" +
                    "<td colspan=5 style='background-color:#7676b8;'><h3 class='text-white'>" + itemTitle + "</h3></td>"+
                    "</tr>"+
                    "<tr>" +
                    "<td><i class='fa fa-circle' style='color:" + RAGColour + "'></i></td>" +
                    "<td>"+itemTeam+"</td>" +
                    "<td>"+itemAlertNum+"</td>" +                       
                    "<td>"+itemStart+"</td>"+
                    "<td>"+itemCreator+"</td>"+
                    "</tr>" +
                    "<tr><td colspan=5 class='text-justify' style='padding-bottom:15px'>" + itemDetail + "</td></tr>";                 

                    if (itemChange === changeTab[count]) {

                        tabName = '#chg' + changeTabNum[count];
                        accordName = '#change' + changeTabNum[count];
                        //alert(dateToday+' '+itemStart);
                        
                        var dateNow = new Date(dateToday);
                        var dateStart = new Date(itemStart);

                        if (dateNow >= dateStart) {
                            //alert('item '+itemID);
                            
                            if (itemContract !== itemContractPrev) {
                                listFolder =  'change' + count + '-Folder' + fCount;
                                var changeAccordion ="<a class='card-link accordion-toggle' data-toggle='collapse'  href='#" + listFolder + "'>" +
                                "<div class='card-header'>" +
                                "<strong>" + contractString + "</strong>" +
                                "</div>" +
                                "</a>" +
                                "<div id='" +listFolder + "' class='collapse' data-parent=" + accordName + ">" +
                                    "<div class='card-body' id='section"+itemID+"Data'>" +                        
                                        "<table class='table table-hover table-sm table-responsive changeTable'>" +
                                            "<thead class='thead-dark'>"+
                                            "<tr>" +
                                            "<th>Status</th>" +
                                            "<th>Team</th>" +
                                            "<th>Alert Number</th>" +                       
                                            "<th>Date of Change</th>"+
                                            "<th>Created By</th>"+                                                                      
                                            "</thead>"+
                                            "<tbody id='"+listFolder+"details'>"+msgString+"</tbody>"+  
                                        "</table>" +
                                    "</div>" +
                                "</div>"; 

                                $(tabName).append(changeAccordion);
                                fCount++;
                            }
                            
                            if(itemContract === itemContractPrev){                                                                                                      
                                $('#'+listFolder+'details').append(msgString);   
                            }
                        }                        
                    }
                    itemContractPrev=itemContract;
                });
            }
        });
    }    
}          