function getMessages() {

    var RAGColour = '';
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    var dateToday = mm + '/' + dd + '/' + yyyy;
    var list = "ImportantMessage";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='EventDate' />" +
        "<FieldREf Name='Title' />" +
        "<FieldRef Name='RAG_Status' />" +
        "<FieldRef Name='Message' />" +
        "<FieldRef Name='StartDate' />" +
        "<FieldRef Name='EndDate' />" +
        "<FieldRef Name='isVisible' />" +
        "</ViewFields>";

    $().SPServices({
        operation: "GetListItems",
        async: false,
        webURL: siteURL,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var isVisible = $(this).attr("ows_isVisible");
                var itemStart = $(this).attr("ows_StartDate");
                var itemStartYYYY = itemStart.substr(0, 4);
                var itemStartDD = itemStart.substr(8, 2);
                var itemStartMM = itemStart.substr(5, 2);
                itemStart = itemStartMM + '/' + itemStartDD + '/' + itemStartYYYY;

                // check if the news item should be displayed
                if (isVisible === 1) {
                    if (dateToday >= itemStart) {

                        var itemID = $(this).attr("ows_ID");
                        var itemDate = $(this).attr("ows_EventDate");
                        var itemTitle = $(this).attr("ows_Title");
                        var itemRAG = $(this).attr("ows_RAG_Status");
                        var itemMessage = $(this).attr("ows_Message");
                        var itemEnd = $(this).attr("ows_EndDate");
                        itemEnd = itemEnd.split(';#')[1];
                        var itemEndYYYY = itemEnd.substr(0, 4);
                        var itemEndDD = itemEnd.substr(8, 2);
                        var itemEndMM = itemEnd.substr(5, 2);
                        var itemDateYYYY = itemDate.substr(0, 4);
                        var itemDateDD = itemDate.substr(8, 2);
                        var itemDateMM = itemDate.substr(5, 2);
                        itemEnd = itemEndMM + '/' + itemEndDD + '/' + itemEndYYYY;
                        itemDate = itemDateMM + '/' + itemDateDD + '/' + itemDateYYYY;

                        //console.log('today=' + dateToday + " itemDate=" + itemDate + " itemStart=" + itemStart + " itemEnd=" + itemEnd + " visible=" + isVisible);

                        switch (itemRAG) {
                            case 'High':
                                RAGColour = 'red';
                                break;
                            case 'Medium':
                                RAGColour = 'yellow';
                                break;
                            case 'Low':
                                RAGColour = 'green';
                                break;
                        }

                        $('#notifications').removeClass('hidden');
                        $('#pageContent').removeClass('msgBannerAdjust');

                        var dispDate = itemDateDD + '/' + itemDateMM + '/' + itemDateYYYY;
                        var msgString = "<div class='ti_news'><a href='#' style='cursor:default;color:white!important'>" +
                            "<i class='fa fa-circle' style='color:" + RAGColour + "'></i> " +
                            "<strong>" + dispDate + " " +
                            "" + itemTitle + "</strong> : " +
                            "<i>" + itemMessage + "</i>" +
                            "</a>&nbsp&nbsp&nbsp</div>";
                        $('#importantMsg').append(msgString);
                    }                
                }

                // check if the news item should be removed
                if (dateToday > itemEnd) {
                    makeVisible(itemID, 0);
                    isVisible = 0;
                }
            });
        }
    });
}

function makeVisible(id, flag) {

    var method = "UpdateListItems";
    var list = "ImportantMessage";

    $().SPServices({
        operation: method,
        async: false,
        listName: list,
        batchCmd: "Update",
        ID: id,
        valuepairs: [["isVisible", flag]],
        completefunc: function (xData, Status) {
            //getMessages();
            return;
        }
    });
}