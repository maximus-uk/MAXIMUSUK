function getTeamLinkData(appURL,teamSite) {

    // Setup Local Variables
    var method = "GetListItems";
    //var teamURL = URL+"/";
    //var appURL="https://"+URL.split('/')[2]+"/";
    var list = "Useful Links";
    var fields = "<ViewFields>" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Group' />" +
        "<FieldRef Name='SortOrder' />" +
        "<FieldRef Name='URL' />" +
        "<FieldRef Name='BrowseMethod' />" +
        "</ViewFields>";
    var query = "<Query><OrderBy><FieldRef Name='Group' Ascending='TRUE'/><FieldRef Name='SortOrder' Ascending='TRUE'/></OrderBy></Query>";
    var linkGroupPrev = "";
    var linkCount=0; 
    
    console.log("appURL="+appURL);

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
                var linkURL = $(this).attr("ows_URL").split(",")[0];
                var pageTarget = $(this).attr("ows_BrowseMethod");

                if(linkGroup !== linkGroupPrev){ 
                    var groupCard = '<!-- ***** Group 0 is the '+linkGroup+' links ***** -->'+
                                    '<div class="card" id="usefulLinksTeam">'+                     
                                    '<a class="accordion-toggle card-link" data-toggle="collapse" href="#group0" style="text-decoration:none">'+
                                    '<div class="card-header">'+
                                    '<strong id="groupTitle0">'+
                                    linkGroup +
                                    '</strong>'+
                                    '</div>'+
                                    '</a>'+
                                    '<div id="group0" class="collapse" data-parent="#accordion">'+
                                    '<div class="list-group" id="linksTeam">'+
                                    '<a href="' + linkURL + '" target="' + pageTarget + '">'+
                                    '<div class="list-group-item">' + linkTitle + '</div>'+
                                    '</a>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>'; 
                    $('#teamLinks').append(groupCard); 
                }

                if(linkGroup === linkGroupPrev && linkCount>0){
                    $("#linksTeam").append("<a href='" + linkURL + "' target='" + pageTarget + "'><div class='list-group-item'>" + linkTitle + "</div></a>");
                }

                linkGroupPrev = linkGroup;
                linkCount++;
            });
        }
    });

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
                            '<strong>'+
                            '<h5 style="margin:-2px 0 0 15px;padding-top:5px;">Moderators<hr style="margin-top:2px;color:#545487;"/></h5>'+
                            '</strong>'+
                            '<div id="moderatorUser" style="margin-top:-20px!important"></div>'+
                            '</div>'+
                            '</div>'+
                            '</div> <!-- end contacts card -->');
};