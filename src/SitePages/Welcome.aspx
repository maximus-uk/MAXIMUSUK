<%@ Register TagPrefix="WpNs0" Namespace="Microsoft.SharePoint.Portal.WebControls" Assembly="Microsoft.SharePoint.Portal, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@ Assembly Name="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>
<%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WikiEditPage" MasterPageFile="/_catalogs/masterpage/MAXUK/welcome.master"      MainContentID="PlaceHolderMain" meta:progid="SharePoint.WebPartPage.Document" %>
<%@ Import Namespace="Microsoft.SharePoint.WebPartPages" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
	<style>
		#suiteBarTop, #s4-ribbonrow{display:none}
	</style>
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">

	<div class="row sectionTitles">
		<div class="col-7 ml-4">
			<div class="row float-left pb-2">
				<h3 class="ml-2">Today's News</h3>
			</div>
		</div>
		<div class="col-4">
			<div class="row float-left pb-2">
				<h3 class="ml-4">Access your business unit intranet</h3>
			</div>
		</div>			
	</div>	


	<div class="row">	
		<!-- ***** Slideshow ***** -->
		<div class="col-7 ml-2">		
			<div class="carousel slide" id="slideshowApp" data-ride="carousel">                                   
				<div class="carousel-inner">
					<div id="slideItems"></div>
					<ul class="carousel-indicators" id="indicators"></ul>                                       
					<a class="carousel-control-prev" href="#slideshowApp" role="button" data-slide="prev">
						<span class="carousel-control-prev-icon" aria-hidden="true"></span>
						<span class="sr-only">Previous</span>
					</a>
					<a class="carousel-control-next" href="#slideshowApp" role="button" data-slide="next">
						<span class="carousel-control-next-icon" aria-hidden="true"></span>
						<span class="sr-only">Next</span>
					</a>                                                                                                 
				</div>	
			</div>
		</div>

		<!-- ***** Company Logos ***** -->
		<div class="col-4">
			<section class="p-0" id="portfolio">
				<div class="container-fluid p-0">
					<div class="row no-gutters">

						<div class="logoContainer MaxUK">
							<a class="portfolio-box" href="/sitepages/home.aspx" target="_blank">
								<div class="borders">								
									<img class="img-fluid" src="/publishingimages/logos/maximus-uk_logo.png" alt="" />
								</div>
								<div class="portfolio-box-caption">
									<div class="portfolio-box-caption-content">
										<div class="project-name">
											Central Services Intranet
										</div>
									</div>
								</div>
							</a>
						</div>
												
						<div class="logoContainer CHDA">	
							<a class="portfolio-box" href="/sites/chda/sitepages/home.aspx" target="_blank">
								<div class="borders">
										<img class="img-fluid" src="/publishingimages/logos/chda_logo.png" alt="" />
								</div>									
								<div class="portfolio-box-caption">
									<div class="portfolio-box-caption-content">
										<div class="project-name">
											CHDA Intranet
										</div>
									</div>
								</div>
							</a>							
						</div>		

						<div class="logoContainer MPS">
							<a class="portfolio-box" href="/sites/esd/sitepages/home.aspx" target="_blank">
								<div class="borders">
									<img class="img-fluid" src="/publishingimages/logos/mps_logo.png" alt="" />
								</div>
								<div class="portfolio-box-caption">
									<div class="portfolio-box-caption-content">
										<div class="project-name">
											ESD Intranet
										</div>
									</div>
								</div>
							</a>
						</div>						
					</div>						

					<div class="row no-gutters">	

						<div class="logoContainer Revitalise">
							<a class="portfolio-box" href="/sites/revitalised/sitepages/home.aspx" target="_blank">
								<div class="borders">
									<img class="img-fluid revitalisedLogo" src="/publishingimages/logos/revitalised_logo.png" alt="" />
								</div>
								<div class="portfolio-box-caption">
									<div class="portfolio-box-caption-content">
										<div class="project-name">
											Revitalised Intranet
										</div>
									</div>
								</div>
							</a>
						</div>

						<div class="logoContainer HML">
							<a class="portfolio-box" href="/sites/HML/sitepages/home.aspx" target="_blank">
								<div class="borders">
									<img class="img-fluid" src="/publishingimages/logos/hml_logo.png" alt="" />
								</div>
								<div class="portfolio-box-caption">
									<div class="portfolio-box-caption-content">
										<div class="project-name">
											HML Intranet
										</div>
									</div>
								</div>
							</a>
						</div>

					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- SCRIPTS --> 
	<script src="/Style%20Library/maxuk/js/maxukSlider.js" type="text/javascript"></script>	   
	<script type="text/javascript"> 		
		
	</script>

</asp:Content>