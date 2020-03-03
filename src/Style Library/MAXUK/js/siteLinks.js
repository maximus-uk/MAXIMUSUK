function getLinkData(URL,site) {   
    
    var method = "GetListItems";
    var list = "Useful Links";
    var fields = "<ViewFields>" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Group' />" +
        "<FieldRef Name='GroupID' />" +
        "<FieldRef Name='SortOrder' />" +
        "<FieldRef Name='URL' />" +
        "<FieldRef Name='Team' />" +
        "<FieldRef Name='BrowseMethod' />" +
        "</ViewFields>";
    var query = "<Query><OrderBy><FieldRef Name='Group' Ascending='TRUE'/><FieldRef Name='SortOrder' Ascending='TRUE'/></OrderBy></Query>";
    var appURL="https://"+URL.split('/')[2]+"/";
    var buName=URL.split('/')[4];
    var linkGroupPrev = "";
    var groupID;
    var linkCount=0;
    var cardIDName = "";
    //console.log("buname="+buName+" appURL="+appURL);

    $().SPServices({
        operation: method,
        async: false,
        webURL: appURL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var linkTitle = $(this).attr("ows_Title");
                var linkGroup = $(this).attr("ows_Group");
                var linkGroupID = $(this).attr("ows_GroupID");
                var siteName = $(this).attr("ows_Team");//.split(";#")[1];
                var linkURL = $(this).attr("ows_URL");//.split(",")[0];
                var pageTarget = $(this).attr("ows_BrowseMethod");

                if(linkGroupID!==undefined){groupID=linkGroupID.split(';#')[1];groupID=groupID.split('.')[0];}
                if(siteName != undefined){siteName = siteName.split(";#")[1];}
                if(linkURL != undefined){linkURL = linkURL.split(";#")[0];}
                console.log(groupID);
                
                if(linkGroup==="MAXIMUS UK"){
                    cardIDName="MAXIMUSUK";
                }else{
                    cardIDName=linkGroup;
                }

                if(linkGroup !== linkGroupPrev){ 
                    var groupCard = '<!-- ***** Group '+groupID+' is the '+linkGroup+' links ***** -->'+
                                    '<div class="card" id="usefulLinks'+cardIDName+'">'+                     
                                    '<a class="card-link accordion-toggle" data-toggle="collapse" href="#group'+groupID+'" style="text-decoration:none">'+
                                    '<div class="card-header">'+
                                    '<strong id="groupTitle'+groupID+'">'+
                                    linkGroup +
                                    '</strong>'+
                                    //'<div class="accordion-toggle"></div>' +
                                    '</div>'+
                                    '</a>'+
                                    '<div id="group'+groupID+'" class="collapse" data-parent="#accordion">'+
                                    '<div class="list-group" id="links'+cardIDName+'">'+
                                    '<a href="' + linkURL + '" target="' + pageTarget + '">'+
                                    '<div class="list-group-item">' + linkTitle + '</div>'+
                                    '</a>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>'; 
                     
                    //groupID++;
                }                                         

                if(buName===linkGroup || linkGroup==="MAXIMUS UK"){
                    $('#maxLinks').append(groupCard);
                }

                if(linkGroup === linkGroupPrev && linkCount>0){
                    $("#links" + cardIDName).append("<a href='" + linkURL + "' target='" + pageTarget + "'><div class='list-group-item'>" + linkTitle + "</div></a>");
                }

                linkGroupPrev = linkGroup;
                linkCount++;
            });
        }
    });
};