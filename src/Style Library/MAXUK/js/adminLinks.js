function getLinks(siteURL,teamName,siteName,linksID,docsID,formsID,faqsID) {
   
    // **** Lists & Libraries in this Team Site
    $('#metroTiles_FD').append('<a href="' + siteURL + '/Lists/MetroTiles_FD/PowerUser.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Tiles</a>');            
    $('#usefulLinks').append('<a href="' + siteURL + '/Lists/UsefulLinks/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Links</a >');
    $('#welcomeText').append('<a href="' + siteURL + '/Lists/WelcomeMessage/message.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Text</a >');
    $('#faqs1').append('<a href="' + siteURL + '/Lists/FAQs/Edit%20FAQs.aspx#InplviewHash684b3b02-9f20-4263-b46b-ea9a6cc5b1fe=ShowInGrid%3DTrue" target="_blank" role="button" class="btn btn-primary button">Edit List</a>');
    $('#faqs2').append('<a href="' + siteURL + '/_layouts/15/FldEdit.aspx?List=%7B' + faqsID + '%7D&Field=Category" target="_blank"><b>Category</b></a>');
    $('#contacts').append('<a href="' + siteURL + '/Lists/Contacts/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit List</a >' +
        				  '&nbsp<a href="' + siteURL + '/TeamPhotos/Forms/Thumbnails.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Photos</a>');
	
	// **** Team only section
    $('#metroTiles').append('<a href="' + siteURL + '/Lists/MetroTiles/PowerUser.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Tiles</a>');
    $('#teamLinks').append('<a href="' + siteURL + '/Lists/UsefulLinks/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Links</a>');
    $('#teamDocs').append('<a href="' + siteURL + '/Documents/Forms/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a>' +
   						  '&nbsp<a href="' + siteURL + '/_layouts/15/FldEdit.aspx?List=%7B' + docsID + '%7D&Field=category" target="_blank" role="button" class="btn btn-primary button">Category</a>');	
    $('#teamForms').append('<a href="' + siteURL + '/Forms/Forms/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a>' +
						   '&nbsp<a href="' + siteURL + '/_layouts/15/FldEdit.aspx?List=%7B' + formsID + '%7D&Field=category" target="_blank" role="button" class="btn btn-primary button">Category</a>');
	$('#teamForum').append('<a href="' + siteURL + '/Lists/Community%20Discussion/Management.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Posts</a>' +
    						'&nbsp<a href="' + siteURL + '/Lists/Members/AdminView.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Members</a>' +
							'&nbsp<a href="' + siteURL +  '/Lists/Categories/AdminView.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Categories</a>');
    $('#permissions').append("<a href='" + siteURL + "/_layouts/15/user.aspx' alt='edit group' target='_blank' role='button' class='btn btn-primary button'>Edit Permissions</a>");	           

	// **** Lists in other sites
    $('#news').append('<a href="/about/Lists/News/' + teamName + '.aspx" target="_blank" role="button" class="btn btn-primary button">Edit List</a>' +
        			  '&nbsp<a href= "/about/PublishingImages/Forms/' + teamName + '.aspx" target= "_blank" role= "button"class="btn btn-primary button">Edit Images</a>');
 
	// **** Document Libaries   
    $('#maps').append('<a href="/about/Maps/Forms/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a >');
    $('#branding').append('<a href="/teams/communications/Branding/Forms/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a >');
    $('#templates').append('<a href="/teams/communications/Templates/Forms/AllItems.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a >');

    $('#knMgmt').append('<a href="/knowledge/Documents/Forms/' + siteName + '_Management.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a >');    
    $('#knStandards').append('<a href="/knowledge/Documents/Forms/' + siteName + ' Standards.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a >');
    $('#knGeneral').append('<a href="/knowledge/Documents/Forms/' + siteName + '_General.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a >');
    $('#knGuides').append('<a href="/knowledge/Guides/Forms/' + siteName + '.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a>');
    $('#knPolicy').append('<a href="/knowledge/Policies/Forms/' + siteName + '.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a>');
    $('#knProcs').append('<a href="/knowledge/Procedures/Forms/' + siteName + '.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a>');
    $('#knForms').append('<a href="/knowledge/Forms/Forms/' + siteName + '.aspx" target="_blank" role="button" class="btn btn-primary button">Edit Files</a>');
};	
							