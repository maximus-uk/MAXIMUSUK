function getNewsItems(teamName) {           

    //Local Variables
    var currentNewsCount = 0;
	var archiveNewsCount = 0;

    var url = _spPageContextInfo.webAbsoluteUrl;
    var rootURL = url.split(".chda.maxuk.co.uk/")[0]+".chda.maxuk.co.uk/";
    var siteURL = url.split(".chda.maxuk.co.uk/")[0]+".chda.maxuk.co.uk/about/"; 
	
    //SP Services Variables
    var method = "GetListItems";
    var list = "News";
    var fields = "<ViewFields>" +
        			"<FieldRef Name='ID' />" +
			        "<FieldRef Name='Title' />" +
        			"<FieldRef Name='Team' />" +
        			"<FieldRef Name='NewsImage' />" +
        			"<FieldRef Name='NewsHeadline' />" +
          			"<FieldRef Name='endDate' />" +
        			"<FieldRef Name='startDate' />" +
        		"</ViewFields>";
        					
    $().SPServices({
        operation: method,
        async: false,
        webURL: siteURL,
        listName: list,
        CAMLViewFields: fields,
                
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item
                var ID = ($(this).attr("ows_ID"));
                var newsTitle = ($(this).attr("ows_Title"));
                var teams = ($(this).attr("ows_Team"));
                var newsThumb = ($(this).attr("ows_NewsImage").split(",")[0]);
                var newsHeadline = ($(this).attr("ows_NewsHeadline"));
                var endDate = ($(this).attr("ows_endDate"));
                var startDate = ($(this).attr("ows_startDate"));

                //newsHeadline = jQuery(newsHeadline).text();                       

                // ***** split teams string into seperate items and assign to array slots *****
                var teamSites = teams.split(";#");                                            
				var flagCheck = false;
				
                // ***** reformat start & end date in normalised format *****
                var startYYYY = startDate.substr(0, 4);
                var startMM = startDate.substr(5, 2);
                var startDD = startDate.substr(8, 2);
                var startDate = startMM + '/' + startDD + '/' + startYYYY;

                var endYYYY = endDate.substr(10, 4);
                var endMM = endDate.substr(15, 2);
                var endDD = endDate.substr(18, 2);
                var endDate = endMM + '/' + endDD + '/' + endYYYY;

                // ***** setup date variables *****
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0
                var yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                today = mm + '/' + dd + '/' + yyyy;

                var articleString = "<div class='row newsMast highlight' id='"+ID+"'>" +
                                    "<a href='#' onclick='getArticle(" + ID + ");return false;'>" +
                                    	"<div class='col-md-3 col-lg-3 col-sm-3'>" +
                                    		"<img alt='News Thumbnail' src='" + newsThumb + "'/>" +
                                    	"</div>" +                                    
                                   		"<div class='col-md-9 col-lg-9 col-sm-9 text-left'>" +
                                    		"<h3>" + newsTitle + "</h3>" +
                                    		"<div class='newsHeadline'>" + newsHeadline + "</div>" +
                                    	"</div>" +
                                    "</a>" +
                                    "</div>" +                                    
                                    "</br>";
												
				// ***** check if new item is still within publication dates
                if (typeof today <= typeof endDate) {
                	if (typeof today >= typeof startDate) {
				
                        // cycle through array items for team names
                        for (inc = 1; inc <= teamSites.length-1; inc+=2) {							
							
                            // if news item is for All teams or current team display article
                            if (teamSites[inc] === teamName  || teamSites[inc] == "All" && flagCheck === false) { 	                                                                       
                                $('#newsMastCurrent').append(articleString);                                           
                                currentNewsCount++;
                                flagCheck = true;
                            };
                        };
                    };
                }else {
                    $('#newsMastArchive').append(articleString);
                    archiveNewsCount++;
                };
            });
        }
    });

    var noItemsString = "<div class='row newsMast'>" +
                        	"<div class='col-md-3 col-lg-3 col-sm-3'>" +
                        		"<img alt='News Thumbnail' src='"+rootURL+"PublishingImages/archiveBoxSmall.png'/>" +
                        	"</div>" +                                    
                       		"<div class='col-md-9 col-lg-9 col-sm-9 text-left'>";                        		                                   

    // no articles found - display message
    if (currentNewsCount == 0) { $("#newsMastCurrent").append(noItemsString+"<h3>There are no current news stories</h3></div></div>"); };
    if (archiveNewsCount == 0) { $("#newsMastArchive").append(noItemsString+"<h3>There are no archive news stories</h3></div></div>"); };
};

function clearDetails() {
    $("#newsDetail").empty();
}

function getArticle(articleID) {

    clearDetails();

    var method = "GetListItems";
    var siteURL = "~/about/";
    var list = "News";
    var fields = "<ViewFields>" +
    	"<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='NewsImage' />" +
        "<FieldRef Name='newsURL' />" +
        "<FieldRef Name='MainText' />" +
        "</ViewFields>";
    var query = "<Query><Where><Eq><FieldRef Name='ID' /><Value Type='Number'>" + articleID + "</Value></Eq></Where></Query>";
    
	$('#'+articleID).addClass('selectedNews');

    $().SPServices({
        operation: method,
        async: false,
        webURL: siteURL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).find("z\\:row").each(function () {

                // assign variables to SP list items
                var newsID = ($(this).attr("ows_ID"));
                var newsTitle = ($(this).attr("ows_Title"));
                var newsImage = ($(this).attr("ows_NewsImage").split(",")[0]);
                var newsLink = ($(this).attr("ows_newsURL"));
                var newsText = ($(this).attr("ows_MainText"));
				
				if(typeof newsLink === 'undefined') { 
					newsLink='https://intranet.chda.maxuk.co.uk/'; 
				}else {
					newsLink=newsLink.split(",")[0];
				};
				
				if(newsID == articleID) {
	                $("#newsDetail").append("<img alt='Main Image' src='" + newsImage + "' width='100%' height='200px'/>" +
	                    "<h2>" + newsTitle + "</h2>");
	                if(newsLink==rootURL) {    
				    	$("#newsDetail").append("<p class='text-justify'>" + newsText + "</p>");
	                }else {
	                    $("#newsDetail").append("<a href='" + newsLink + "' target='_blank'>View Full Page</a>" +
	                    						"<p class='text-justify'>" + newsText + "</p>");
					};
                };
            });

        }
    });
};