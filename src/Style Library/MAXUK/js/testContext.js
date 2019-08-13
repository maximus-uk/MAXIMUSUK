	<script type="text/javascript">

		SP.SOD.executeFunc('sp.js', null, function(){
     		retrieveCurrentListProperties();
		})
		
		ExecuteOrDelayUntilScriptLoaded(getListId, "sp.js");

        var siteURL = _spPageContextInfo.webAbsoluteUrl;
        var siteName;
        var siteTitle;      
		var list;
		var listID;
		var clientContext;
		var groupCollection;
								    		                  		
        //var item = new SP.Taxonomy.TaxonomyFieldValue();
        //var team = item.get_item('Finance');
        //var teamCatLabel = team.get_label();
        //var teamID = team.get_termGuid();

        //alert('team=' + siteurl);

        if (typeof (MSOLayout_MakeInvisibleIfEmpty) == "function") {
            MSOLayout_MakeInvisibleIfEmpty();
        };
       	
       	$(function () {            			
			
	        $.ajax({
	            url: siteURL + "/_api/web/title",
	            method: "GET",
	            headers: { "Accept": "application/json; odata=verbose" },
	            success: function (data) {
	                siteTitle = data.d.Title;
	                siteName = siteURL.split('co.uk/teams/')[1];

	                $('#pageTitle').append('<a href= "'+siteURL+'/sitepages/frontdoor.aspx" class="homeLink"><SharePoint:ProjectProperty Property="Title" runat="server" __designer:Preview="Operations" __designer:Values="&lt;P N=&#39;Property&#39; T=&#39;Title&#39; /&gt;&lt;P N=&#39;InDesign&#39; T=&#39;False&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl01&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/></a> > Admin');	               
	                
	                getLogo('Admin');
	                getLinks(siteURL,siteTitle,siteName,listID);

	                getGroupID(siteTitle, siteName, 'Owners', 'groupOwner');
	                getGroupID(siteTitle, siteName, 'Members', 'groupMember');
	                getGroupID(siteTitle, siteName, 'Managers', 'groupManager');
	                getGroupID(siteTitle, siteName, 'Visitors', 'groupVisitor');
	                getGroupID(siteTitle, siteName, 'Power Users', 'groupPower');
	                getGroupID(siteTitle, siteName, 'Read', 'groupRead');	                	
	            },
	            error: function (data) {
	                alert("Error: " + data);
	            }
	        });			
		});
		
		function getListId() {
		
			clientContext = new SP.ClientContext.get_current();    

			//if(clientContext != undefined && clientContext != null) {
	
			var web = clientContext.get_web();
			var listCollection = web.get_lists();
		 	groupCollection = web.get_siteGroups();
			
			list = listCollection.getByTitle('FAQs'); 
			clientContext.load(list, 'Id');
   				
			//var viewCollection = list.get_views();
			//var view = viewCollection.getByTitle("Name of View");
			 
			//context.load(view);     
			
			//};
			    		
    		clientContext.executeQueryAsync(Function.createDelegate(this, success), Function.createDelegate(this, error));		
		};

		function success() {
			listID = list.get_id();
			//alert('list id='+listID);			
		}
		
		function error() {
		    alert('Request failed. ' + args.get_message() + 
		          '\n' + args.get_stackTrace());		
		}

        function getGroupID(team,site,level,idLink) {

			var groupName = team + " " + level;
            var a = document.getElementById(idLink);
            
            //alert('groupName=' + groupName);			
            
            //var siteURL = "https://intranet.chda.maxuk.co.uk/teams/" + site;         
            var group = groupCollection.getByName(groupName);
            clientContext.load(group);             		         
            
            clientContext.executeQueryAsync(
                function () {
                    var membershipGroupId = group.get_id();
                    var groupURL = "https://intranet.chda.maxuk.co.uk/teams/" + site + "/_layouts/15/people.aspx?MembershipGroupId=" + membershipGroupId;
                    a.href= groupURL;
                                                        
            		//$(idLink).append("<a href='" + siteURL + "/_layouts/15/people.aspx?MembershipGroupId=" + membershipGroupID + "' alt='edit group' target='_blank'>" +
	                //                 "<span class='glyphicon glyphicon-pencil'></span>" + level + "</a>");	            
                },
                function (sender, args) {
                    alert('Error\n' + args.get_message());
                }               
            );
        };
										
//		function execOperation() {
//		    try {
//		        clientContext = new SP.ClientContext.get_current();                   
//		    }
//		    catch (err) {
//		        alert(err);
//		    }
//		}						
			   
		//$( window ).on( "load", function() {
		//	alert('window loaded');
		//});

    </script>
