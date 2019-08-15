function setTabs() {

	var activeTab;
	var activeID;
	
	$('#tabs a').click(function(e) {
		
		// prevent default page actions
		e.preventDefault();
		
		// set active tab to local storage for use later     
		localStorage.setItem('activeTab', $(e.target).attr('href'));               

		// clear current active tab
		$('#tabs li').removeClass('active');
		$('div').removeClass('active');      
		$('li a').removeClass('selectedTab');

	});

	// on load of the page: switch to the currently selected tab
	activeTab = localStorage.getItem('activeTab');
    if (activeTab !== null) {
        activeID = activeTab.split('#')[1];
    }		
		
	if(activeTab===undefined){
		// if no tab selected set the first tab as active	
        $('#tabs li:first').addClass('active');
        $('div [id="tab1"]').addClass('active');
	}else {
		// clear current active tab and content
		$('li a').removeClass('selectedTab');
		$('#tabs li').removeClass('active');
		$('div').removeClass('active');
	}
	
	// make selected tab active
	$('li a[href="'+activeTab+'"]').addClass('selectedTab');
	$('li a[href="'+activeTab+'"]').closest('li').addClass('active');
	$('div [id="'+activeID+'"]').addClass('active');
}