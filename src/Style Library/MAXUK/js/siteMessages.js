function getWelcomeText(teamName) {
	
	var contactHTML = '';
	
    // Setup Local Variables
    var method = "GetListItems";
    var list = "WelcomeMessage";
    var fields = "<ViewFields>" +
                "<FieldRed Name='ID' />" +
                "<FieldRef Name='introduction' />" +
                "<FieldRef Name='goal' />" +
				//"<FieldRef Name='availability' />" +
				"<FieldRef Name='help_01' />" +
				"<FieldRef Name='help_02' />" +
				"<FieldRef Name='help_03' />" +
				"<FieldRef Name='help_04' />" +
				"<FieldRef Name='help_05' />" +
				"<FieldRef Name='help_06' />" +
				"<FieldRef Name='help_07' />" +
				"<FieldRef Name='help_08' />" +
				"<FieldRef Name='help_09' />" +
				"<FieldRef Name='help_10' />" +
				"<FieldRef Name='support_01' />" +
				"<FieldRef Name='support_02' />" +
				"<FieldRef Name='support_03' />" +				                
				"<FieldRef Name='support_04' />" +
				"<FieldRef Name='support_05' />" +
				"<FieldRef Name='support_06' />" +
				"<FieldRef Name='support_07' />" +
				"<FieldRef Name='support_08' />" +
				"<FieldRef Name='support_09' />" +
				"<FieldRef Name='support_10' />" +
				"<FieldRef Name='email' />" +
				"<FieldRef Name='telephone' />" +				
				"</ViewFields>";
    
    $().SPServices({
        operation: method,
        async: false,
        //webURL: URL,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
				//alert(teamName);

                var listID = $(this).attr("ows_ID");
                var siteIntro = $(this).attr("ows_introduction");
                var siteGoal = $(this).attr("ows_goal");
                //var siteAvailable = ($(this).attr("ows_availability"));
                var siteHelp01 = $(this).attr("ows_help_01");
                var siteHelp02 = $(this).attr("ows_help_02");
                var siteHelp03 = $(this).attr("ows_help_03");
                var siteHelp04 = $(this).attr("ows_help_04");
                var siteHelp05 = $(this).attr("ows_help_05");
                var siteHelp06 = $(this).attr("ows_help_06");
                var siteHelp07 = $(this).attr("ows_help_07");
                var siteHelp08 = $(this).attr("ows_help_08");
                var siteHelp09 = $(this).attr("ows_help_09");
                var siteHelp10 = $(this).attr("ows_help_10");
                var siteSupport01 = $(this).attr("ows_support_01");
                var siteSupport02 = $(this).attr("ows_support_02");
                var siteSupport03 = $(this).attr("ows_support_03");
                var siteSupport04 = $(this).attr("ows_support_04");
                var siteSupport05 = $(this).attr("ows_support_05");
                var siteSupport06 = $(this).attr("ows_support_06");
                var siteSupport07 = $(this).attr("ows_support_07");
                var siteSupport08 = $(this).attr("ows_support_08");
				var siteSupport09 = $(this).attr("ows_support_09");
				var siteSupport10 = $(this).attr("ows_support_10");
                var siteEmail = $(this).attr("ows_email");
                var sitePhone = $(this).attr("ows_telephone");
				//alert(teamName);				
                //if(teamName==="Health and Safety"){alert(listID)};
				
				console.log("intro="+siteIntro);
				
                if(listID == 1) {
                	$('#siteWelcomeText').append('<h2>Welcome to the ' + teamName + ' team site</h2>' +
                								 '<p>' + siteIntro + '</p><ul></ul>' +
                								 '<h4><strong>Our goal is</strong></h4>' +
                								 '<blockquote>' + siteGoal + '</blockquote>' +
                								 //'<h4 style="color:#545487!important"><strong>We are available</strong></h4>' +
                								 //'<ul class="noHover"><li>'+ siteAvailable +'</li></ul><p></p>'+
                								 '<h4><strong>We can help you</strong></h4>' +
                								 '<ul id="siteHelp"></ul>' +
                								 '<h4><strong>How we support the business</strong></h4>' +
                								 '<ul id="siteSupport"></ul>' +
                								 '<h4><strong>How to contact us</strong></h4><p id="contact"></p>');
										
					if(siteHelp01.length > 1){					 	
                		$('#siteHelp').append('<li>'+ siteHelp01 + '</li>');
                	};
					if(siteSupport01.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport01 + '</li>');
                	};
                	
					if(siteHelp02.length > 1){					 	
                		$('#siteHelp').append('<li>'+ siteHelp02 + '</li>');
                	};
					if(siteSupport02.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport02 + '</li>');
                	};
                	
					if(siteHelp03.length > 1){					 	
                		$('#siteHelp').append('<li>'+ siteHelp03 + '</li>');
                	};
					if(siteSupport03.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport03 + '</li>');
                	};
                	
					if(siteHelp04.length > 1 ){					 	
                		$('#siteHelp').append('<li>'+ siteHelp04 + '</li>');
                	};
					if(siteSupport04.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport04 + '</li><span>');
                	};
                	
					if(siteHelp05.length > 1 ){					 	
                		$('#siteHelp').append('<li>'+ siteHelp05 + '</li>');
                	};
					if(siteSupport05.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport05 + '</li>');
                	};
                	
					if(siteHelp06.length > 1 ){					 	
                		$('#siteHelp').append('<li>'+ siteHelp06 + '</li>');
                	};					
					if(siteSupport06.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport06 + '</li>');
                	};

					if(siteHelp07.length > 1 ){					 	
                		$('#siteHelp').append('<li>'+ siteHelp07 + '</li>');
                	};					
					if(siteSupport07.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport07 + '</li>');
                	};

					if(siteHelp08.length > 1 ){					 	
                		$('#siteHelp').append('<li>'+ siteHelp08 + '</li>');
                	};					
					if(siteSupport08.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport08 + '</li>');
                	};

					if(siteHelp09.length > 1 ){					 	
                		$('#siteHelp').append('<li>'+ siteHelp09 + '</li>');
                	};					
					if(siteSupport09.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport09 + '</li>');
                	};

					if(siteHelp10.length > 1 ){					 	
                		$('#siteHelp').append('<li>'+ siteHelp10 + '</li>');
                	};                						
					if(siteSupport10.length > 1 ){					 	
                		$('#siteSupport').append('<li>'+ siteSupport10 + '</li>');
                	};
					
					if(sitePhone == null || sitePhone === undefined){						
						contactHTML='';	
					}else {
						contactHTML ='<span class="fa fa-phone" style="color:#000">&nbsp'+ sitePhone;
					};
					
					$('#contact').append('<a href="mailto:'+ siteEmail +'?subject=Contact from CHDA Intranet site">'+
										 '<i class="fa fa-envelope" style="color:#000"></i>&nbsp'+
										 teamName +'</a>&nbsp&nbsp' + contactHTML);
                };
            });
        }
        //alert('hello');
    });       	        	
};
