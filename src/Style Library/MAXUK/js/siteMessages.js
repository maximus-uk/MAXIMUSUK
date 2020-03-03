function getWelcomeText(teamName) {
	
	var contactHTML = '';
	
    // Setup Local Variables
    var method = "GetListItems";
    var list = "WelcomeMessage";
    var fields = "<ViewFields>" +
                "<FieldRed Name='ID' />" +
                "<FieldRef Name='Introduction' />" +
				"<FieldRef Name='email' />" +
				"<FieldRef Name='telephone' />" +				
				"</ViewFields>";
    
    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var listID = $(this).attr("ows_ID");
                var siteIntro = $(this).attr("ows_Introduction");
                var siteEmail = $(this).attr("ows_email");
                var sitePhone = $(this).attr("ows_telephone");
				
                if(listID == 1) {
					$('#siteWelcomeText .title').append('<h2 style="display:inline-flex">Welcome to the ' + teamName + ' site <div class="editIcon" id="editWelcome"></div></h2>');
					$('#siteWelcomeText .body').append('<p>' + siteIntro + '</p><ul></ul><h4><strong>How to contact us</strong></h4><p id="contact"></p>');

					if(sitePhone === null || sitePhone === undefined){						
						contactHTML='<i>No Contact Information Supplied</i>';	
					}else {
						contactHTML ='<span class="fa fa-phone" style="color:#000">&nbsp'+ sitePhone;
					};
					
					$('#contact').append('<a href="mailto:'+ siteEmail +'?subject=Contact from CHDA Intranet site">'+
										 '<i class="fa fa-envelope" style="color:#000"></i>&nbsp'+
										 teamName +'</a>&nbsp&nbsp' + contactHTML);
                };
            });
        }
    });       	        	
};
