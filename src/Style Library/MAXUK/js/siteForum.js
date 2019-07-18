"use strict";
var postCategories = [];
var emailFlag = "";
var replyText = "";
var sentDate = "";
var numApprovals = 0;
var sWidth = screen.width;
var sHeight = screen.height;
var dHeight = $(document).height();
var dWidth = $(document).width();

function clearPosts() {
    $('#postDetail').empty();
    $('#editPostForm').empty();
    $('#newPostForm').empty();
}

function makeActive(tabNum) {
    $('#postTabNames li').removeClass('buttonOn');
    $("#postTabNames li:nth-child(" + tabNum + ")").addClass('buttonOn');
}

function showRules() {
    $('#postDetail').html("");
    $('#postDetail').append("<h3>Forum Rules</h3>" +
        //"<p>Some common sense rules to start with:</p>" +
        "<ul>" +
        "<li> Do not post inappropriate material</li>" +
        "<li> Do not post ‘offensive’ posts, links or images</li>" +
        "<li> Remain respectful of other members at all times</li>" +
        "<li> Do not cross post questions</li>" +
        "<li> No spam / advertising / self-promotion in the forums</li>" +
        //"<li><span class='glyphicon glyphicon-record'></span> Don't share anything illegal, threatening or offensive.</li>" +
        //"<li><span class='glyphicon glyphicon-record'></span> No spam. Don't post anything that inappropriately promotes a business, product, or service.</li>" +
        //"<li><span class='glyphicon glyphicon-record'></span> Don't stoop to insults. If someone upsets you, respond to the issue rather than questioning the character of the person.</li>" +
        //"<li><span class='glyphicon glyphicon-record'></span> Be civil. No insults to colleagues or customers.</li>" +
        //"<li><span class='glyphicon glyphicon-record'></span> Respect people's privacy.  Customer identifiable data is prohibited." + 
        //"<li><span class='glyphicon glyphicon-record'></span> Don't share anyone else's personal information." + 
        //"<li><span class='glyphicon glyphicon-record'></span> Don't post messages from other people or share their personal communications without their permission.</li>" +
        "</ul>" +
        "<br/>" +
        "<h4>Help make our community a great place for everyone.</h4>");
}

function getCategories() {

    var ID = 4;
    var tabName;
    var method = "GetListItems";
    var list = 'Categories';
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "</ViewFields>";

    $().SPServices({
        async: false,
        operation: method,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {

            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                tabName = ($(this).attr("ows_Title"));
                //tabName = $(this).text();
                $("#postTabNames").append("<li>" +
                    "<a onclick='showRules();makeActive(" + ID + ");return false;' class='tabButton' data-toggle='pill' href='#fTab" + ID + "'><p>" + tabName + "</p></a>" +
                    "</li>");
                $("#postTabData").append('<div id="fTab' + ID + '" class="tab-pane fade in dataTab">' +
                    '<div class="panel-group" id="' + tabName + '"></div>' +
                    '</div>');
                postCategories.push(tabName);
                ID++;
            });
        }
    });

    $("#postTabNames").append("<li><a onclick='showRules();makeActive(" + ID + ");return false;' class='tabButton' data-toggle='pill' href='#fTab" + ID + "'><p>My Posts</p></a></li>");
    $("#postTabData").append('<div id="fTab' + ID + '" class="tab-pane fade in dataTab">' +
        '<div class="panel-group" id="My"></div>' +
        '</div>');
}

function getPosts(siteURL) {

    //Local Variables
    var allCount = 0;
    var newCount = 0;
    var featureCount = 0;
    var myCount = 0;
    var meetingCount = 0;
    var generalCount = 0;
    var catCount = 0;
    var postString = "";
    var question = "";
    var badgeName = "none";

    // SPServices Variables
    var method = "GetListItems";
    var list = 'Discussions List';
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='CategoriesLookup' />" +
        "<FieldRef Name='Created' />" +
        "<FieldRef Name='Author' />" +
        "<FieldRef Name='IsQuestion' />" +
        "<FieldRef Name='ItemChildCount' />" +
        "<FieldRef Name='FileRef' />" +
        "<FieldRef Name='_ModerationStatus' />" +
        "<FieldRef Name='IsFeatured' />" +
        "</ViewFields>";
    var query = "<Query><OrderBy><FieldRef Name='Created' Ascending='False'/></OrderBy></Query>";
    var userName = $().SPServices.SPGetCurrentUser({
        fieldName: "Title",
        debug: false
    });

    $('#newPostButton').append('<a href="#" onclick="newPost(\'' + siteURL + '\')" role="button" class="btn btn-default newPostBtn">Start New Post</a>');

    if (!siteURL) { siteURL = ""; };

    $().SPServices({
        operation: method,
        async: false,
        webURL: siteURL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQuery: query,
        completefunc: function (xData, Status) {

            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item
                var ID = ($(this).attr("ows_ID"));
                var postTitle = ($(this).attr("ows_Title"));
                var postCategory = ($(this).attr("ows_CategoriesLookup"));
                var postDate = ($(this).attr("ows_Created"));
                var postBy = ($(this).attr("ows_Author"));
                var postQuestion = ($(this).attr("ows_IsQuestion"));
                var postReplies = ($(this).attr("ows_ItemChildCount"));
                var postFilePath = ($(this).attr("ows_FileRef"));
                var postStatus = ($(this).attr("ows__ModerationStatus"));
                //var postPopular = ($(this).attr("ows_Popularity"));
                var postFeatured = ($(this).attr("ows_IsFeatured"));

                // ***** reformat start & end date in normalised format *****
                var postYYYY = postDate.substr(0, 4);
                var postMM = postDate.substr(5, 2);
                var postDD = postDate.substr(8, 2);
                var postTime = postDate.substr(11, 8);

                postDate = postDD + '/' + postMM + '/' + postYYYY;

                // ***** setup date variables *****
                var today = new Date();
                var dd = today.getDate() - 7;
                var mm = today.getMonth() + 1; //January is 0
                var yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                today = dd + '/' + mm + '/' + yyyy;

                var author = postBy.split(';#')[1];
                postReplies = postReplies.split(';#')[1];
                postFilePath = postFilePath.split(';#')[1];

                if (postQuestion === "1") {
                    question = "<h3 class='badge postQuestion'>?</h3>";
                } else {
                    question = "";
                }

                if (postTitle !== undefined & postStatus === '0') {

                    postString = "<div class='row rowDivider'>" +
                        "<a href='#' class='highlight' onclick='getRootPost(\"" + siteURL + "\",\"" + postFilePath + "\"," + allCount + ");return false;'>" +
                        "<div class='col-lg-9 col-md-9 col-sm-9 text-left addLeft10'>" +
                        "<h4>" + postTitle + "</h4>" +
                        "<h6 style='margin-top:-5px!important;line-height:1.4;'>Posted " + postDate + " @ " + postTime + "<br/>by " + author + " <span class='badge myBadge' id='postBadge" + allCount + "'></span></h6>" +
                        "</div>" +
                        "</a>" +
                        "<div class='col-lg-1 col-md-1 col-sm-1 postReplies'>" +
                        "<nobr><h3><span class='badge'>" + postReplies + "</span></h3></nobr>" + question +
                        "</div>" +
                        "</div>";

                    if (mm === postMM) {
                        $('#New').append(postString);
                        getBadge("post", postBy, allCount);
                        newCount++;
                    }

                    if (postFeatured === 1) {
                        $('#Featured').append(postString);
                        getBadge("post", postBy, allCount);
                        featureCount++;
                    }

                    postCategory = postCategory.split(';#')[1];

                    for (var i = 0; i < postCategories.length; i++) {
                        if (postCategory === postCategories[i]) {

                            var tempNamespace = {};
                            var category = postCategory.toLowerCase();
                            var catPostString = "<div class='row rowDivider'>" +
                                "<a href='#' class='highlight' onclick='getRootPost(\"" + siteURL + "\",\"" + postFilePath + "\"," + allCount + ");return false;'>" +
                                "<div class='col-lg-9 col-md-9 col-sm-9 text-left addLeft10'>" +
                                "<h4>" + postTitle + "</h4>" +
                                "<h6 style='margin-top:-5px!important;line-height:1.4;'>Posted " + postDate + " @ " + postTime + "<br/>by " + author + " <span class='badge myBadge' id='" + category + "Badge" + allCount + "'></span></h6>" +
                                "</div>" +
                                "</a>" +
                                "<div class='col-lg-1 col-md-1 col-sm-1 postReplies'>" +
                                "<nobr><h3><span class='badge'>" + postReplies + "</span></h3></nobr>" + question +
                                "</div>" +                                
                                "</div>";

                            switch (postCategory) {
                                case 'Meeting':
                                    meetingCount++;
                                    break;
                                case 'General':
                                    generalCount++;
                                    console.log("getPosts = #" + category + "Badge" + allCount);
                                    break;
                                default:
                                    catCount++;
                                    tempNamespace[postCategory] = catCount;
                                    break;
                            }
                            $('#' + postCategories[i]).append(catPostString);
                            getBadge(category, postBy, allCount);
                        }
                    }

                    /*					if(postTitle.indexOf("Meeting") != -1 || postCategory == 'Meeting'){
                                            $('#Meeting').append(postString);
                                            meetingCount++;
                                        }					
                    */
                    if (author === userName) {
                        var myPostString = "<div class='row rowDivider'>" +
                            "<a href='#' class='highlight' onclick='getRootPost(\"" + siteURL + "\",\"" + postFilePath + "\");return false;'>" +
                            "<div class='col-lg-9 col-md-9 col-sm-9 text-left addLeft5'>" +
                            "<h4>" + postTitle + "</h4>" +
                            "<h6>Posted " + postDate + " @ " + postTime + "<br/>by " + author + "</h6>" +
                            "</div>" +
                            "</a>" +
                            "<div class='col-lg-1 col-md-1 col-sm-1 subLeft5 postReplies'>" +
                            "<h3><span class='badge'>" + postReplies + "</span></h3><br/>" +
                            "</div>" +                            
                            "<div class='col-lg-1 col-md-1 col-sm-1 postReplies'>" +
                            //"<a href='"+editPostPath+"' id='editPostBtn' target='editPostFrame' role='button' class='btn btn-default button' style='width:25px;height:25px;padding:2px 2px 0 2px!important;margin:17px 15px 0 -5px!important'><center><span class='glyphicon glyphicon-pencil'></center></span></a>" +
                            "<a href='#' onclick='editPost(\"" + siteURL + "\"," + ID + ",\"" + postFilePath + "\");return false;' role='button' class='btn btn-default button editPostBtn' style='width:25px;height:25px;padding:2px 2px 0 2px!important;margin:17px 15px 0 -5px!important'><center><span class='glyphicon glyphicon-pencil'></center></span></a>" +
                            "</div>" +
                            "</div>";
                        $('#My').append(myPostString);
                        //getBadge(postBy, allCount);
                        myCount++;
                    }

                    $('#All').append(postString);
                    getBadge('post', postBy, allCount);
                    allCount++;
                }
            });
        }
    });

    // no posts - display relevant message
    if (allCount === 0) { $("#All").append("<span>There are no posts</span>"); };
    if (newCount === 0) { $("#New").append("<span>There are no new posts</span>"); };
    if (featureCount === 0) { $("#Featured").append("<span>There are no featured posts</span>"); };
    if (meetingCount === 0) { $("#Meeting").append("<span>There are no meeting posts</span>"); };
    if (myCount === 0) { $("#My").append("<span>You have not posted anything</span>"); };

    for (var i = 0; i < postCategories.length; i++) {
        switch (postCategories[i]) {
            case 'General':
            case 'Meeting':
                break;
            default:
                if (catCount === 0) {
                    $("#" + postCategories[i]).append("<span>There are no posts for this category</span>");
                }
                break;
        }
    }
}

function getRootPost(URL, filePath, badgeID) {

    clearPosts();
    $('#newPostForm').addClass('hidden');
    $('#editPostForm').addClass('hidden');
    $('#postDetail').removeClass('hidden');

    var count = 0;

    // SPServices Variables
    var method = "GetListItems";
    var list = 'Discussions List';
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='FileRef' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Created' />" +
        "<FieldRef Name='Author' />" +
        "<FieldRef Name='Body' />" +
        "</ViewFields>";
    //var queryOpts = "<QueryOptions><ViewAttributes Scope='RecursiveAll' IncludeRootFolder='True'/></QueryOptions>";
    //var queryOpts = "<QueryOptions><ViewAttributes Scope='RecursiveAll' IncludeRootFolder='True'/><Folder>" + filePath + "</Folder></QueryOptions>";
    var query = "<Query><Where><Eq><FieldRef Name='FileRef'/><Value Type='Text'>" + filePath + "</Value></Eq></Where><OrderBy><FieldRef Name='FileRef' Ascending='TRUE'/></OrderBy></Query>";

    $().SPServices({
        operation: method,
        async: false,
        webURL: URL,
        listName: list,
        CAMLViewFields: fields,
        //CAMLQueryOptions: queryOpts,
        CAMLQuery: query,
        completefunc: function (xData, Status) {

            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var postID = $(this).attr("ows_ID");
                var postFilePath = $(this).attr("ows_FileRef");
                var postTitle = $(this).attr("ows_Title");
                var postDate = $(this).attr("ows_Created");
                var postBy = $(this).attr("ows_Author");
                var postBody = $(this).attr("ows_Body");

                // ***** reformat start & end date in normalised format *****
                var postYYYY = postDate.substr(0, 4);
                var postMM = postDate.substr(5, 2);
                var postDD = postDate.substr(8, 2);
                var postTime = postDate.substr(11, 8);

                postDate = postDD + '/' + postMM + '/' + postYYYY;

                var author = postBy.split(';#')[1];
                var postName = filePath.split("/Community Discussion/")[1];

                //if(postTitle === postName){							
                var postTitleString = "<div class='row addLeft10 rowDivider postRow'>" +
                    "<h3>" + postTitle + "</h3>" +
                    "<h4>Posted " + postDate + " @ " + postTime + " by " + author + " <span class='badge myBadge' id='rootBadge" + badgeID + "'></span></h4>" +
                    "<p>" + postBody + "</p>" +
                    "<div class='replyContainer form-group'>" +
                    "<textarea class='expand form-control' rows='1' cols='50' id='replyText' placeholder='enter your reply message...'></textarea>" +
                    "<button type='button' class='btn btn-default replyPostBtn alignRight savechanges' onclick='addReply(\"" + URL + "\",\"" + postID + "\",\"" + filePath + "\");return false;' data-dismiss='modal' data-id='reply'>Post</a>" +
                    "</div>" +
                    "</div>";
                $('#postDetail').append(postTitleString);
                getBadge('root', postBy, badgeID);
                //};								            	
            });
        }
    });
    getReplyPost(URL, filePath, badgeID);
}

function getReplyPost(URL, filePath, badgeID) {

    var count = 1;
    var postName = filePath.split("/Community Discussion/")[1];
    var postDate = "";

    // SPServices Variables
    var method = "GetListItems";
    var list = 'Discussions List';
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='FileRef' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Created' />" +
        "<FieldRef Name='Author' />" +
        "<FieldRef Name='Body' />" +
        "</ViewFields>";
    var queryOpts = "<QueryOptions><ViewAttributes Scope='RecursiveAll' IncludeRootFolder='True'/><Folder>" + filePath + "/</Folder></QueryOptions>";
    var query = "<Query><Where><Contains><FieldRef Name='FileRef'/><Value Type='Text'>" + filePath + "</Value></Contains></Where><OrderBy><FieldRef Name='FileRef' Ascending='TRUE'/></OrderBy></Query>";

    $().SPServices({
        operation: method,
        async: false,
        webURL: URL,
        listName: list,
        CAMLViewFields: fields,
        CAMLQueryOptions: queryOpts,
        CAMLQuery: query,
        completefunc: function (xData, Status) {

            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var postID = ($(this).attr("ows_ID"));
                var postFilePath = ($(this).attr("ows_FileRef"));
                var postTitle = ($(this).attr("ows_Title"));

                postDate = ($(this).attr("ows_Created"));

                var postBy = ($(this).attr("ows_Author"));
                var postBody = ($(this).attr("ows_Body"));

                // ***** reformat start & end date in normalised format *****
                var postYYYY = postDate.substr(0, 4);
                var postMM = postDate.substr(5, 2);
                var postDD = postDate.substr(8, 2);
                var postTime = postDate.substr(11, 8);

                postDate = postDD + '/' + postMM + '/' + postYYYY;

                var postReplyFolder = postFilePath.split("/Community Discussion/")[1];
                var postReplies = postReplyFolder.split("/")[0];
                var postNum = postReplyFolder.split("/")[1];
                var replyPath = postFilePath.split(";#")[1];

                var author = postBy.split(';#')[1];

                //if(postReplyFolder != postName+'/'+postNum){alert('first post');};

                if (postName === postReplies && postReplyFolder === postName + '/' + postNum) {
                    var postDetailString = "<div class='row addLeft20 rowDivider postRow'>" +
                        "<h4>Posted " + postDate + " @ " + postTime + " by " + author + " <span class='badge myBadge' id='replyBadge" + count + "'></span></h4>" +
                        "<p>" + postBody + "</p>" +
                        //"<div class='replyContainer form-group'>" +
                        //"<textarea class='expand form-control' rows='1' cols='50' id='replyText' placeholder='enter your reply message...'></textarea>" +
                        //"<button type='button' class='btn btn-default replyPostBtn alignRight savechanges' onclick='addReply(\""+postID+"\",\""+postReplyFolder+"\");return false;' data-dismiss='modal' data-id='reply'>Reply</a>" +
                        //"</div>" +
                        "</div>";

                    $('#postDetail').append(postDetailString);
                    getBadge('reply', postBy, count);
                    count++;
                }
            });
        }
    });
}

function addReply(URL, id, filePath) {

    //var replyText='';
    //var siteURL = _spPageContextInfo.webAbsoluteUrl;
    var method = "UpdateListItems";
    var list = 'Discussions List';
    var alertFlag = getAlertFlag();
    var emails = "";

    replyText = $('#replyText').val();
    //console.log('postID='+id+', add a reply to:'+filePath+', text to add:'+replyText);

    if (replyText !== "") {
        $.ajax({
            url: URL + "/_api/web/title",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                var siteTitle = data.d.Title;
                var group = siteTitle + " Moderators";
                emails = getModerators(group);

                $('#replyText').val('enter your reply message...');

                $().SPServices({
                    operation: method,
                    async: false,
                    //webURL: URL,
                    listName: list,
                    batchCmd: "New",
                    updates: "<Batch OnError='Continue' RootFolder='" + "/" + filePath + "'>" +  // RootFolder needs to start with / 
                        "<Method ID='1' Cmd='New'>" +
                        "<Field Name='ContentType'>Message</Field>" +
                        "<Field Name='FSObjType'>0</Field>" +
                        "<Field Name='Body'>" + replyText + "</Field>" +
                        "</Method>" +
                        "</Batch>",
                    completefunc: function (xData, Status) {
                        if (alertFlag === "1") {
                            //sendEmail(URL, "Admin", "jclark@maximusuk.co.uk", "you have a new forum reply post for approval", "Forum Approval Required");
                            console.log(URL+" - "+emails);
                        }
                        location.reload(true);
                    }
                });
            }
        });
    } else {
        alert('Please enter a message in the reply text area before clicking the post button');
    }
}

function newPost(siteURL) {

    var newPostPath = siteURL + "/Lists/Community%20Discussion/AddPost.aspx";

    $('#postDetail').addClass('hidden');
    $('#editPostForm').addClass('hidden');
    $('#newPostForm').removeClass('hidden');
    $('#newPostForm').html('');
    $('#newPostForm').append('<iframe name="newPostFrame" id="newPost" src="' + newPostPath + '" scrolling="no"></iframe>');

    /*
        var context = new ClientContext(siteURL);
        var user = context.Web.EnsureUser(“loginname”);
        context.Load(user);
        context.ExecuteQuery();
        var email = new EmailProperties();
        email.To = new string[] { user.LoginName };
        email.Subject = “Test subject”;
        email.Body = “Test body”;
        Utility.SendEmail(context, email);
    
        context.ExecuteQuery(); // ServerException thrown here
        context.Dispose();
    */
}

function editPost(siteURL, ID, postPath) {

    var editPostPath = siteURL + "/Lists/Community%20Discussion/EditPost.aspx?ID=" + ID + "&Source=" + postPath;
    console.log(editPostPath);

    $('#postDetail').addClass('hidden');
    $('#newPostForm').addClass('hidden');
    $('#editPostForm').removeClass('hidden');
    $('#editPostForm').html('');
    $('#editPostForm').append('<iframe name="editPostFrame" id="editPost" src="' + editPostPath + '" scrolling="no"></iframe>');
}

function getApprovals(siteURL) {

    // SPServices Variables
    var count = 0;
    var method = "GetListItems";
    var list = 'Discussions List';
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='_ModerationStatus' />" +
        "</ViewFields>";

    if (!siteURL) { siteURL = ""; };

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
                var postStatus = ($(this).attr("ows__ModerationStatus"));

                if (postStatus === '2') { count++; };
            });
        }
    });
    return count;
}

function sendEmail(siteURL, from, to, body, subject) {

    var urlTemplate = siteURL + "/_api/SP.Utilities.Utility.SendEmail";
    console.log("Approval Email Sent to " + to);

    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
            'properties': {
                '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
                'From': from,
                'To': { 'results': [to] },
                'Body': body,
                'Subject': subject
            }
        }),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            console.log("Approval Email Sent to " + to);
        },
        error: function (err) {
            console.log(err.responseText);
            //debugger;
        }
    });
}

function getToolbox(siteURL) {
    var formWidth = dWidth / 1.5;
    var formHeight = dHeight / 1.5;

    $('#toolbox').append('<a href="#" onclick="openDialog(\'' + siteURL + '/Lists/Community%20Discussion/Management.aspx\',\'Forum Management\',' + formHeight + ',' + formWidth + '); return false;">Manage Discussions</a><br />' +
        '<a href="#" onclick="openDialog(\'' + siteURL + '/Lists/Categories/All.aspx\',\'Forum Categories\',' + formHeight + ',' + formWidth + '); return false;">Create Categories</a><br />' +
        '<a href="#" onclick="openDialog(\'' + siteURL + '/Lists/Badges/All.aspx\',\'Forum Badges\',400,400); return false;">Create Badges</a><br />' +
        '<a href="#" onclick="openDialog(\'' + siteURL + '/Lists/Members/All.aspx\',\'Forum Members\',' + formHeight + ',' + formWidth + '); return false;">Assign Badges</a><br />');
}

function checkEmail(emails) {
    numApprovals = getApprovals(siteURL);
    emailFlag = getAlertFlag();

    if (emailFlag == "1") {
        $('#notifyToggle').prop('checked', true);
        $('#notifyIcon').addClass('glyphicon-ok');
        $('#notifyIcon').removeClass('glyphicon-remove');

        //**** check if the email has not been sent today
        if (emailDate < dateToday) {
            sendEmail(siteURL, "", emails, "you have " + numApprovals + " forum post approvals", "Forum Approval");
        }
    } else {
        $('#notifyToggle').prop('checked', false);
        $('#notifyIcon').removeClass('glyphicon-ok');
        $('#notifyIcon').addClass('glyphicon-remove');
    }

    if (numApprovals > 0) {
        $('#postsIcon').append('<a href="' + siteURL + '/Lists/Community%20Discussion/AllItems.aspx" target="_blank" title="You have posts awaiting approval"><span class="glyphicon glyphicon-comment"></span> ' + numApprovals + '</a>');

        var sentYYYY = sentDate.substr(0, 4);
        var sentMM = sentDate.substr(5, 2);
        var sentDD = sentDate.substr(8, 2);
        var emailDate = sentDD + '/' + sentMM + '/' + sentYYYY;
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0
        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd; };
        if (mm < 10) { mm = '0' + mm; };
        var dateToday = dd + '/' + mm + '/' + yyyy;
    }
}

function checkModerator(group) {
    $().SPServices({
        operation: "GetGroupCollectionFromUser",
        userLoginName: $().SPServices.SPGetCurrentUser(),
        async: false,
        completefunc: function (xData, Status) {

            //If the current User logged in does belong to a specific group
            if ($(xData.responseXML).find("Group[Name='" + group + "']").length == 1) {
                $('#postsIcon').removeClass('hidden');
                $('#approvalButton').removeClass('hidden');
                $('#toolbox').removeClass('hidden');
            }
        }
    });
}

function getModerators(group) {
    var emails = "";
    console.log(group);
    $().SPServices({
        operation: "GetUserCollectionFromGroup",
        groupName: group,
        async: false,
        completefunc: function (xDataUser, Status) {
            $(xDataUser.responseXML).find("User").each(function () {
                emails += $(this).attr("Email") + ";";
            });
        }
    });
    console.log(emails);
    return emails;
}

function checkToggle() {
    var flag = $('#notifyToggle').prop('checked');

    if (flag === false) {
        $('#notifyIcon').addClass('glyphicon-remove');
        $('#notifyIcon').removeClass('glyphicon-ok');
        writeAlertFlag(false);
    } else {
        $('#notifyIcon').addClass('glyphicon-ok');
        $('#notifyIcon').removeClass('glyphicon-remove');
        writeAlertFlag(true);
        writeEmailDate(today);
        sentDate = today;
    }
}

function getAlertFlag() {
    var notifications = "";

    // Setup SPServices Variables
    var method = "GetListItems";
    var list = "forumEmails";
    var fields = "<ViewFields>" +
        "<FieldRef Name='emailFlag' />" +
        "<FieldRef Name='dateSent' />" +
        "</ViewFields > ";

    $().SPServices({
        operation: method,
        async: false,
        //webURL: siteURL,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                notifications = $(this).attr("ows_emailFlag");
                sentDate = $(this).attr("ows_dateSent");
            });
        }
    });
    return notifications;
}

function writeAlertFlag(flag) {
    var method = "UpdateListItems";
    var list = 'forumEmails';

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        batchCmd: "Update",
        ID: "1",
        valuepairs: [["emailFlag", flag]],
        completefunc: function (xData, Status) {
            //location.reload(true);
        }
    });
}

function writeEmailDate(emailDate) {
    var method = "UpdateListItems";
    var list = 'forumEmails';
    var dateVal = new Date(emailDate).toISOString();

    $().SPServices({
        operation: method,
        async: false,
        webURL: siteURL,
        listName: list,
        batchCmd: "Update",
        ID: "1",
        valuepairs: [["dateSent", dateVal]],
        completefunc: function (xData, Status) {
            //location.reload(true);
        }
    });
}

function getBadge(item, userName, postID) {

    var badgeName = "";
    var badgeID = "#" + item + "Badge" + postID;

    console.log("getBadge = " + badgeID);

    // *** query Members list with username
    var method = "GetListItems";
    var list = "Community Members";
    var fields = "<ViewFields>" +
        "<FieldRef Name='GiftedBadgeLookup' />" +
        "<FieldRef Name='Member' />" +
        "</ViewFields > ";
    //var query = "<Query><Where><Eq><FieldRef Name='Member'/><Value Type='Text'>" + userName + "</Value></Eq></Where></Query>";		

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        CAMLViewFields: fields,
        //CAMLQuery: query,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var member = $(this).attr("ows_Member");
                badgeName = $(this).attr("ows_GiftedBadgeLookup");

                if (member === userName) {
                    if (badgeName !== undefined) {
                        badgeName = badgeName.split(';#')[1];
                        $(badgeID).append(badgeName);
                        //console.log(badgeName+ " "+badgeID);
                    } else {
                        $(badgeID).append('None');
                    }
                }
            });
        }
    });
}

    // *** get current user
    /*var web = context.get_web();
    var user = web.get_currentUser(); 
    context.load(user);
    context.executeQueryAsync(function () {
        alert("User is: " + user.get_title()); //there is also id, email, so this is pretty useful.
        userName = user.get_title();
    }, function (sender, args) {
        console.log("Error: " + arg.get_message());
    });*/

	//var username = $().SPServices.SPGetCurrentUser();

	/*$().SPServices({
 		operation: "GetGroupCollectionFromUser",
 		userLoginName: $().SPServices.SPGetCurrentUser(),
 		async: false,
 		completefunc: function(xData, Status) { 			
 			if($(xData.responseXML).find("Group[Name='CHDA Intranet Visitors']").length == 1) {
 			
 			};
 		}
 	});*/