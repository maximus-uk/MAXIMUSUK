console.log(list+" : "+tabName);
/*
    if (list !== "Documents"){tabNum=count+1;}

    // *** check user permissions
    $().SPServices({
        operation: "GetGroupCollectionFromUser",
        userLoginName: $().SPServices.SPGetCurrentUser(),
        async: false,
        completefunc: function (xData, Status) {

            //If the current User does belong to the group "SharePoint Group Name"
            if ($(xData.responseXML).find("Group[Name='" + team + " Power Users']").length === 1) {
                hasEdit = true;
                if (list === "Documents"){
                    for (var docx=0; docx < docTabs.length; docx++) {
                        var tabCount = count+docx+1;                            
                        $('#uploadButton'+tabCount).append('<a class="docUpload button btn" role="button" id="docUpload" target="_blank" href="'+listURL+list+'/Forms/'+siteName+'.aspx"><i class="fas fa-file-upload" aria-hidden="true"></i> Upload</a >');                            
                    }
                }                    
            } else {
                hasEdit = false;
            }
        }
    });
*/
    /***** Get Files from Document Library using REST API call *****/
/*    console.time('rest');
    var restDocCount=0;
    var requestUri = listURL+"_api/Web/Lists/getByTitle('"+list+"')/items?$top=1000";  //$filter=KnowledgeCategory eq '"+tabName+"'&
    var caml = "<View><Query><Where><And><Eq><FieldRef Name='KnowledgeTeam'/><Value Type='Text'>"+team+"</Value></Eq><Eq><FieldRef Name='KnowledgeCategory'/><Value Type='Text'>"+tabName+"</Value></Eq></And></Where></Query></View>";
    var requestData = { "query" :
                            {"__metadata": 
                            { "type": "SP.CamlQuery" }
                            , "ViewXml": caml
                            }
                        };
    $.ajax({
        url: requestUri,
        type: "GET",
        async: false,
        data: requestData,
        contentType: "application/json;odata=verbose",
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            for(var i=0;i<data.d.results.length;i++)
            {
                //console.log(data.d.results[i]);

                var docID = data.d.results[i].ID;
                var docName = data.d.results[i].Name; 
                var docCat = data.d.results[i].KnowledgeCategory.Label;                                
                console.log(docID+" - "+docName+" = "+docCat);      
                //var docName = $(this).attr("ows_LinkFilenameNoMenu");
                //var docTitle = $(this).attr("ows_LinkFilenameNoMenu").split(".")[0];
                //var docFolder = $(this).attr("ows_KnowledgeFolder");
                //var docSubFolder = $(this).attr("ows_KnowledgeSubFolder");
                //var docStatus = $(this).attr("ows__ModerationStatus");
                //var teamName = $(this).attr("ows_KnowledgeTeam");//.split(";#")[1];
                //var otherTeams = $(this).attr("ows_KnowledgeSharedWith");
                //var office = $(this).attr("ows_KnowledgeOffice");
                //var sharedTeam = "none";
                var docFQN = listURL + list + '/' + docName;
                //var documentItem = "";
                //var documentString = "";                    
                console.log(data.d.results[i].KnowledgeCategory.TermGuid);
                restDocCount++;
            }
            console.log('rest doc count='+restDocCount);                    
        },
        error: function (data, errorCode, errorMessage) {
            console.log(JSON.stringify(data)+"/n"+errorCode+" : "+errorMessage);
        }
    });
    console.timeEnd('rest');
*/
