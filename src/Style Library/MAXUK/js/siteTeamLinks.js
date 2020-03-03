function getTeamLinkData(appURL,teamSite) {

    // Setup Local Variables
    var method = "GetListItems";
    var buURL="https://"+appURL.split('/')[2]+"/"+appURL.split('/')[3]+"/"+appURL.split('/')[4]+"/";
    var buName=appURL.split('/')[4];
    var subSiteName;
    var editIcon = '<i class="fas fa-edit"></i>';

    var list = "Useful Links";
    var fields = "<ViewFields>" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Group' />" +
        "<FieldRef Name='GroupID' />" +
        "<FieldRef Name='Team' />" +
        "<FieldRef Name='SortOrder' />" +
        "<FieldRef Name='URL' />" +
        "<FieldRef Name='BrowseMethod' />" +
        "</ViewFields>";
    var query = "<Query><OrderBy><FieldRef Name='Group' Ascending='TRUE'/><FieldRef Name='SortOrder' Ascending='TRUE'/></OrderBy></Query>";
 
    var linkGroupPrev = "";
    var linkCount=0;     
    var teamFlag = false;
    var nonTeamFlag = false;
    //var groupCardID="";

    if(appURL.split('/')[5]!=undefined){subSiteName=appURL.split('/')[5];}
    buName = buName.toUpperCase();
    //console.log("buname="+buName+" subsite="+subSiteName+" buURL="+buURL);

    $().SPServices({
        operation: method,
        async: false,
        webURL: buURL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item                      
                var linkTitle = $(this).attr("ows_Title");
                var linkGroup = $(this).attr("ows_Group");
                var linkGroupID = $(this).attr("ows_GroupID");//.split(';#')[1];
                var linkTeam = $(this).attr("ows_Team");//.split(';#')[1];
                var linkURL = $(this).attr("ows_URL").split(",")[0];
                var pageTarget = $(this).attr("ows_BrowseMethod");

                if(linkGroupID!==undefined){groupID=linkGroupID.split(';#')[1];groupID=groupID.split('.')[0];}                
                if(linkTeam !== undefined){linkTeam = linkTeam.split(";#")[1];}

                var groupCard = '<!-- ***** Group '+groupID+' is the '+linkGroup+' links ***** -->'+
                                '<div class="card" id="usefulLinksTeam">'+                     
                                '<a class="card-link accordion-toggle" data-toggle="collapse" href="#group'+groupID+'" style="text-decoration:none">'+
                                '<div class="card-header">'+
                                '<strong id="groupTitle'+groupID+'">'+
                                linkGroup +
                                '</strong>'+
                                //'<div class="accordion-toggle"></div>' +
                                '</div>'+
                                
                                '</a>'+
                                '<div id="group'+groupID+'" class="collapse" data-parent="#accordion">'+
                                '<div class="list-group" id="links'+groupID+'">'+
                                '<a href="' + linkURL + '" target="' + pageTarget + '">'+
                                '<div class="list-group-item">' + linkTitle + '</div>'+
                                '</a>'+
                                '</div>'+
                                '</div>'+
                                '</div>'; 

                var linkItem = "<a href='" + linkURL + "' target='" + pageTarget + "'><div class='list-group-item'>" + linkTitle + "</div></a>"

                switch(subSiteName){
                    case undefined:
                    case 'about':
                    case 'knowledge':
                        nonTeamFlag = true;
                        teamFlag = false;
                        break;
                    default:
                        nonTeamFlag = false;
                        teamFlag = true;
                        break;
                }        

                if(linkGroup===buName || linkTeam===teamSite || linkTeam ==="All") {

                    //console.log("buName="+buName+" linkGroup="+linkGroup+" linkGroupID="+groupID+" teamSite="+teamSite+" linkTeam="+linkTeam+ " subSiteName="+subSiteName +" nonTeamFlag="+nonTeamFlag);

                    if(linkGroup !== linkGroupPrev){ 
                        if(linkGroup===buName){
                            //groupCardID="#buLinks"; 
                            $("#buLinks").append(groupCard);                                                                   
                        } 

                        if(linkGroup==="Team" && nonTeamFlag===false){
                            //groupCardID="#teamLinks";
                            $("#teamLinks").append(groupCard);
                        }                        
                    }

                    if(linkGroup === linkGroupPrev && linkCount>0){
                        $("#links"+groupID).append(linkItem);
                    }
    
                    linkGroupPrev = linkGroup;
                    linkCount++;                    
                }                          
            });
        }
    });

    if(teamFlag===true){
        // ***** add team contacts to the end of the accordion
        $('#accordion').append('<!-- ***** This is for the Site Contacts ***** -->'+
                                '<div class="card" id="usefulLinksSiteContacts">'+
                                '<a class="accordion-toggle" data-toggle="collapse" href="#siteContacts" style="text-decoration:none">'+
                                '<div class="card-header">'+
                                '<strong>Site Contacts</strong>'+
                                '</div>'+
                                '</a>'+
                                '<div id="siteContacts" class="collapse" data-parent="#accordion">'+
                                '<div class="list-group">'+
                                '<strong>'+
                                '<h5 style="margin:-2px 0 0 15px;padding-top:5px;">Owners<hr style="margin-top:2px;color:#545487;"/></h5>'+
                                '</strong>'+
                                '<div id="siteOwner" style="margin-top:-20px!important"></div>'+                                                    
                                '<strong>'+
                                '<h5 style="margin:-2px 0 0 15px;padding-top:5px;">Power Users<hr style="margin-top:2px;color:#545487;"/></h5>'+
                                '</strong>'+
                                '<div id="powerUser" style="margin-top:-20px!important"></div>'+
                                '</div>'+
                                '</div>'+
                                '</div> <!-- end contacts card -->');
    }
};