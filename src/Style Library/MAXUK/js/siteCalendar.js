function changeCalendar() {

	var wWidth = $(window).width();
	var dWidth = wWidth * 0.5;
	var wHeight = $(window).height();
	var dHeight = wHeight * 0.5;

	/***** add chevrons as prev and next buttons *****/
    $('.ecl-title').find('tr td:nth-child(1) a').html("<span class='glyphicon glyphicon-chevron-left'></span>");
    $('.ecl-title').find('tr td:nth-child(3) a').html("<span class='glyphicon glyphicon-chevron-right'></span>");
							
	$('.ecl-event').addClass('showTip'); 
				
	/***** Find the previous button and change the icon *****/		
	$('.ecl-title').find('tr td:nth-child(1) a').attr('id', 'prev'); 			
		
	/***** Find the next button and change the icon *****/
	$('.ecl-title').find('tr td:nth-child(3) a').attr('id', 'next'); 			
				
	/***** Find the month name and change the font size *****/
	$('.ecl-title').find('tr td:nth-child(2)').attr('id', 'month'); 			
																	
	$(".tipContent ul li a").attr('id','eventLink');
	$(".tipContent ul li a").each(function(){
		var link = $(this).attr('href');
		var ID = link.split('?ID=')[1];
		var list = link.split('/Lists/')[1];
		ID=ID.split('&Source')[0];
		
		//alert(link);
		//var newLink = link.split('/Lists/')[0];
		//newLink=newLink+'/sitepages/dispevent.html?ID='+ID; 
		//alert(newLink);
		
		list=list.split('/')[0];
		list=list.replace(/\_/g,' ');
		 
		$(this).attr('onclick','openDialog(\"'+link+'\",\"'+list+'\",'+dHeight+','+dWidth+'); return false;');
		$(this).attr('href','#');
	});			
};

function getCalendarItems(URL,list,month) { 

	//alert(URL+" "+list+" "+month);
	var listName=list.replace(/\_/g,' ');
	var wWidth = $(window).width();
	var dWidth = wWidth * 0.5;
	var wHeight = $(window).height();
	var dHeight = wHeight * 0.5;
	var count;
	var icon = '<i class="fas fa-eye" aria-hidden="true"></i>';
	var folderSection = "";
	var folderNamePrev = "";
	var categoryName = "";
	var fCount = 1;
	var genID = 1;
	var mgmtID = 1;
	var docID = 0;
	var listID;
	var listFolder = "";
    var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var monthLongNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var weekdays =['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	var currentYear = (new Date).getFullYear();
    var period = "";
    var method = "GetListItems";

	var fields = "<ViewFields>" +
				"<FieldRef Name='ID' />" +
				"<FieldRef Name='Name' />" +
				"<FieldRef Name='Title' />" +
				"<FieldRef Name='EventDate' />" +
				"<FieldRef Name='EndDate' />" +
				"<FieldRef Name='Category' />" +
				"<FieldRef Name='fAllDayEvent' />" +
				"</ViewFields>"; 

	//alert(dWidth+" "+dHeight);
	
/*    switch (list) {
        case 'Team_Calendar':
			var fields = "<ViewFields>" +
						"<FieldRef Name='ID' />" +
						"<FieldRef Name='Name' />" +
						"<FieldRef Name='Title' />" +
						"<FieldRef Name='EventDate' />" +
						"<FieldRef Name='EndDate' />" +
						"<FieldRef Name='Category' />" +
						"<FieldRef Name='fAllDayEvent' />" +
						"</ViewFields>";    					           
			break;
        case 'Rota_Calendar':
        case 'Leave_Calendar':
			var fields = "<ViewFields>" +
				"<FieldRef Name='ID' />" +
				"<FieldRef Name='Name' />" +
				"<FieldRef Name='Title' />" +
				"<FieldRef Name='EventDate' />" +
				"<FieldRef Name='EndDate' />" +
				"<FieldRef Name='Category' />" +
				"<FieldRef Name='fAllDayEvent' />" +
				"</ViewFields>";
            break;
    };*/
    
	var query = "<Query><OrderBy><FieldRef Name='Category' Ascending='True' /><FieldRef Name='EventDate' Ascending='True' /></OrderBy></Query>";
					
	//alert(URL+" "+fields);

	$().SPServices({
        operation: method,
		async: false,
		listName: list,
		//webURL: URL,
		CAMLViewFields: fields,
		CAMLQuery: query,
		completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var ID = $(this).attr("ows_ID");
      			var userName = $(this).attr("ows_Name");
                var Title = $(this).attr("ows_Title");
                var startDate = $(this).attr("ows_EventDate");
                var endDate = $(this).attr("ows_EndDate");
                var folderName = $(this).attr("ows_Category");
				var allDay = $(this).attr("ows_fAllDayEvent");
				
                // ***** reformat start & end date in normalised format *****
                var startYYYY = startDate.substr(0, 4);
                var startMM = startDate.substr(5, 2);
                var startDD = startDate.substr(8, 2);
                var startTime = startDate.substr(11,8);                
                startDate = startDD + '/' + startMM + '/' + startYYYY;
                var startDateUSA = startMM + '/' + startDD + '/' + startYYYY;
                var sDate = new Date(startDateUSA);               
                var startWeekday = sDate.toString().split(' ')[0];
				var startDateFull = startWeekday + ' ' + startDD + ' ' + monthShortNames[startMM - 1] + ' ' + startYYYY;
				
                var endYYYY = endDate.substr(0, 4);
                var endMM = endDate.substr(5, 2);
                var endDD = endDate.substr(8, 2);
                var endTime = endDate.substr(11, 8);
				endDate = endDD + '/' + endMM + '/' + endYYYY;
				var endDateComp = endYYYY + "-" + endMM; // + "-" + endDD;
				var endDateUSA = endMM + '/' + endDD + '/' +endYYYY;
				var eDate = new Date(endDateUSA);
				var endWeekday = eDate.toString().split(' ')[0];
				var endDateFull = endWeekday + ' ' + endDD + ' ' + monthShortNames[endMM - 1] + ' ' + endYYYY;
				
                // ***** setup date variables *****
                var today = new Date();
                var todayDD = today.getDate();
                var todayMM = today.getMonth() + 1; //January is 0
                var todayYYYY = today.getFullYear();

				var allDayTxt="";
				
                if (todayDD < 10) {
                    todayDD = '0' + todayDD;
                }

                if (todayMM < 10) {
                    todayMM = '0' + todayMM;
                }

                today = todayDD + '/' + todayMM + '/' + todayYYYY;
				var todayComp = todayYYYY+"-"+todayMM; //+"-"+todayDD;

/*                        switch (folderName) {
                    case 'Holiday':
                        icon = pdfIcon;
                        break;
                    case 'Sick':                            
                        icon = wordIcon;
                        break;
                    case 'Rota':
                        icon = xlIcon;
                        break;
                    case 'Meeting':
                        icon = ppIcon;
                        break;
                };
*/                        		
                switch (list) {
                    case 'Team_Calendar':
                        listID = 'Team';   					           
      					break;
                    case 'Rota_Calendar':
                        listID = 'Rota';
                        break;
                    case 'Leave_Calendar':
                        listID = 'Leave';
                        break;
                }
		
				if(userName !== undefined || Title === 'update') {
					Name=userName.split(';#')[1];										
				}else if(Title !== undefined && userName === undefined) {
					Name=Title.split(';#')[1];
					swapData(list,URL);
					//alert(Name);
				}
				
				/*if(Title !== undefined && userName === 'na') {
					Name=Title;					
				};*/
												
				if(allDay===1){allDayTxt = "All Day"}else{allDayTxt=''};
				//alert(endDateComp+"-"+todayComp);
				
				if(endDateComp >= todayComp) {
					
					if(allDay===1 && startDD === endDD) {
 						period = startDateFull;
					}else if (allDay===1 && startDD !== endDD) {
					    period = startDateFull + " - " + endDateFull;
					}else {
						period = startDateFull+' '+startTime+' - '+endDateFull+' '+endTime;
					}
					
	                if (folderName === folderNamePrev) {		                    
	                    var documentString = '<div class="row calListItem">' +		                        
	                        //'<div class="col-sm-1 col-md-1 col-lg-1">' + icon + '</div>' +
							'<a href="#" onclick="openDialog(\''+URL+'/Lists/'+list+'/DispEvent.aspx?ID='+ID+'\',\''+listName+'\','+dHeight+','+dWidth+'); return false;">' +
	                        '<div class="col-sm-3 col-md-3 col-lg-3 text-left" style="margin-left:25px">' +
	                        '<p class="docItem">' + Name + '</p>' +
	                        '</div>' +
	                        '<div class="col-sm-6 col-md-6 col-lg-6 text-left">' +
	                        '<p>'+ period + '</p>' +
	                        '</div>' +
	                        '<div class="col-sm-2 col-md-2 col-lg-2 text-left">' +
	                        '<p>'+ allDayTxt + '</p>' +
							'</div>' +
							'</a>' +
	                        '</div>';
	
	                    $('#' + listFolder + 'Item').append(documentString);
	                }
	                		            
				    if (folderName !== folderNamePrev) {
				    
						listFolder = listID + 'Folder' + fCount;
	                    var folderString = '<div class="panel documentFolder">' +
						                        '<a data-toggle="collapse" data-parent="#' + list + '" href="#' + listFolder + '" style="text-decoration:none">' +
						                        '<div class="panel-heading">' +
						                        	'<div class="panel-title">' +
						                        		'<h3 class="folderTitle" style="margin:7px 0 0 0;">' + folderName + '</h3>' +
						                        	'</div>' +
						                        '</div>' +
						                        '</a>' +
						                        '<div id="' + listFolder + '" class="panel-collapse collapse docList">' +
							                        '<div class="list-group" id=' + listFolder + 'Item>' +
								                        '<div class="row firstRow calListItem">' +
									                        '<a href="#" onclick="openDialog(\''+URL+'/Lists/'+list+'/DispEvent.aspx?ID='+ID+'\',\''+listName+'\','+dHeight+','+dWidth+'); return false;">' +
									                        //'<div class="col-sm-1 col-md-1 col-lg-1">' + icon + '</div>' +
									                        '<div class="col-sm-3 col-md-3 col-lg-3 text-left" onMouseOver="this.style.color=\'white\'" style="margin-left:25px">' +
									                        '<p class="docItem">' + Name + '</p>' +
									                        '</div>' +
									                        '<div class="col-sm-6 col-md-6 col-lg-6 text-left" onMouseOver="this.style.color=\'white\'">' +
									                        '<p>'+ period + '</p>' +
									                        '</div>' +
									                        '<div class="col-sm-2 col-md-2 col-lg-2 text-left" onMouseOver="this.style.color=\'white\'">' +
									                        '<p>'+ allDayTxt + '</p>' +
															'</div>' +
															'</a>'+
								                        '</div>' +
							                        '</div>' +
						                        '</div>' +
						                    '</div>';
	
	                    $('#' + listID).append(folderString);		                    
	                	fCount++;
	                }	                		            
	            	folderNamePrev = folderName;
	            }		                
			});
		}
	});
}
	       	
function swapData(list,URL) { 
	
    var method = "GetListItems";
    var fields = "<ViewFields>" +
		        "<FieldRef Name='ID' />" +
		        "<FieldRef Name='Name' />" +
		        "<FieldRef Name='Title' />" +
		        "</ViewFields>";		
	//alert(list+" "+URL);
    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,		        
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var ID = $(this).attr("ows_ID");		                
                var Name = $(this).attr("ows_Name");
                var Title = $(this).attr("ows_Title");
				var fieldName;
				var fieldData;
				var tempTitle='';
				
                /*switch (list) {
                    case 'Team_Calendar':                   
                    case 'Rota_Calendar':
                    case 'Leave_Calendar':
                        var Name = ($(this).attr("ows_Name"));
                        var Title = ($(this).attr("ows_Title"));
                        break;
                };*/		

				tempTitle = Title.split(';#')[1];
				
				if(Title === 'update') {
					fieldData=Name.split(';#')[1];	
					fieldName='Title';
					//alert("1st Condition: "+listName+" id="+id+" / name="+name+" ("+userName+")");									
				}
				
				if(Name === undefined) {					
					fieldData=getNameMeta(Title,URL);
					fieldName='Name';					
					//alert("2nd Condition: "+list+" id="+ID+" / name="+Name+" ("+Title+")");											
				}
				
				if(fieldName !== undefined || fieldData !== undefined) {
					updateField(list, ID, fieldName, fieldData);
                }
            });
        }
    });
}

function updateField(list,id,field,data) {

    var method = "UpdateListItems";
						
    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        batchCmd: "Update",
        ID: id,
        valuepairs: [[field,data]],
        completefunc: function (xData, Status) {		        		 
            //alert('Fields Updated');
        }
    });		    					    
}

function getNameMeta(field,URL) {

    var metaID = "";
    var method = "GetListItems";
    var fields = "<ViewFields>" +        	
        	"<FieldRef Name='ID' />" +
        	"<FieldRef Name='Title' />" +        	
        	"</ViewFields>";
    var query = "<Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>" + field + "</Value></Eq></Where></Query>";

    $().SPServices({
        operation: method,
        async: false,
        webURL: URL,     
        listName: 'Contacts',
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var ID = ($(this).attr("ows_ID"));
                var Name = ($(this).attr("ows_Title"));
                metaID=ID+";#"+Name;
            });
        }
    });
    return metaID;
}
