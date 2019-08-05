var categories = [];
var tabNum = [];

function getTabs(siteURL) {

    var method = "GetList";
    var url = siteURL + "/";
    var list = "FAQs";
    var ID = 0;

    $().SPServices({
        async: false,
        operation: method,
        webURL: url,
        listName: list,
        completefunc: function (xData, Status) {

            $(xData.responseXML).find("Field[DisplayName='Category'] CHOICE").each(function () {
                categories[ID] = $(this).text();
                tabNum[ID] = ID;
                ID++;
            });
        }
    });

    categories.sort();

    if (categories.length === 0) {
        $("#tabData").append('There currently are no FAQs to display');
    } else {
        for (var i = 1; i <= categories.length; i++) {

            if (i === 1) {
                $("#tabNames").append("<li class='active'>" +
                    "<a data-toggle='pill' href='#tab0'>" + categories[0] + "</a>" +
                    "</li>");
                $("#tabData").append("<div id='tab0' class='tab-pane fade in active'>" +
                    "<div class='row panel-group' style='margin-bottom: 10px;' id='accordion0'>" +
                    "<div id='C0' class='panel panel-primary'>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }

            if (i >= 2) {
                var x = i - 1;
                $("#tabNames").append("<li>" +
                    "<a data-toggle='pill' href='#tab" + x + "'>" + categories[x] + "</a>" +
                    "</li>");
                $("#tabData").append("<div id='tab" + x + "' class='tab-pane fade in'>" +
                    "<div class='row panel-group' style='margin-bottom: 10px;' id='accordion" + x + "'>" +
                    "<div id='C" + x + "' class='panel panel-primary'>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }
        }
    }
}

function getItems(siteURL) {

    var method = "GetListItems";
    var list = "FAQs";
    var url = siteURL;
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Title' />" +
        "<FieldRef Name='Category' />" +
        "<FieldRef Name='Answer' />" +
        "</ViewFields>";
    var count;

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
                var faqQuestion = ($(this).attr("ows_Title"));
                var faqCategory = ($(this).attr("ows_Category"));
                var faqAnswer = ($(this).attr("ows_Answer"));
                var tabName = "";
                var accordName = "";

                for (count = 0; count <= categories.length - 1; count++) {
                    if (faqCategory === categories[count]) {
                        tabName = '#C' + tabNum[count];
                        accordName = '#faq' + tabNum[count];
                        //alert(categories[count]+" : "+faqCategory + " : " + tabName);                    		
                    }
                }

                $(tabName).append("<a class='accordion-toggle' data-toggle='collapse' data-parent=" + accordName + " href='#section" + ID + "'>" +
                    "<div class='panel-heading'>" +
                    "<div class='panel-title faqQuestion'>" +
                    "<strong>" + faqQuestion + "</strong>" +
                    "</div>" +
                    "</div>" +
                    "</a>" +
                    "<div id='section" + ID + "' class='panel-collapse collapse faqAnswer'> " +
                    "<div class='list-group'>" +
                    "<blockquote>" + faqAnswer + "</blockquote>" +
                    "</div>" +
                    "</div><p></p>");

            });
        }
    });
}