function getTabs(listName) {

    var method = "GetList";
    var list = listName;
    var ID = 0;
    var tabName;

    $().SPServices({
        async: false,
        operation: method,
        listName: list,
        completefunc: function (xData, Status) {

            $(xData.responseXML).find("Field[DisplayName='category'] CHOICE").each(function () {
                categories[ID] = $(this).text();
                if (categories[ID].length > 18) {
                    categories[ID] = categories[ID].substr(0, 18);
                };
                tabNum[ID] = ID;
                //if(ID<8){ID++;};
                ID++;
            });
        }
    });

    categories.sort();

    if (categories.length == 0) {
        $("#tabNames").append('There currently are no items to display');
    } else {
        for (i = 1; i <= categories.length; i++) { //categories.length        	            
            if (i == 1) {
                $("#tabNames").append("<li class='active'>" +
                    "<a data-toggle='pill' href='#tab0' onclick='clearViewer(\"0\");return false;'>" + categories[0] + "</a>" +
                    "</li>");
                $("#tabData").append("<div id='tab0' class='tab-pane fade in active'>" +
                    "<div class='col-sm-4 col-md-4 col-lg-4 scrollbar teamDocumentFoldersContainer'>" +
                    "<div class='panel-group teamDocumentFolders' id='docFoldersTab0'></div>" +
                    "</div>" +
                    "<div class='col-sm-7 col-md-7 co-lg-7 teamDocumentViewerContainer'>" +
                    "<div id='docViewer0' class='teamDocumentViewerFrame'></div>" +
                    "</div>" +
                    "</div>");
            };

            if (i >= 2) {
                var x = i - 1;
                $("#tabNames").append("<li>" +
                    "<a data-toggle='pill' href='#tab" + x + "' onclick='clearViewer(" + x + ");return false;'>" + categories[x] + "</a>" +
                    "</li>");
                $("#tabData").append('<div id="tab' + x + '" class="tab-pane fade in">' +
                    "<div class='col-sm-4 col-md-4 col-lg-4 scrollbar teamDocumentFoldersContainer'>" +
                    '<div class="panel-group teamDocumentFolders" id="docFoldersTab' + x + '"></div>' +
                    '</div>' +
                    "<div class='col-sm-7 col-md-7 co-lg-7 teamDocumentViewerContainer'>" +
                    "<div id='docViewer" + x + "' class='teamDocumentViewerFrame'></div>" +
                    '</div>' +
                    '</div>');

            };
            showMessage(i - 1);
        };
    };
};