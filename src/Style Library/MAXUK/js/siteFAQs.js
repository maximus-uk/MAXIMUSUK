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
                $("#tabNames").append("<li class='nav-item'>" +
                    "<a class='nav-link active' data-toggle='pill' href='#tab0' role='tab'>" + categories[0] + "</a>" +
                    "</li>");
                $("#tabData").append("<div id='tab0' class='tab-pane fade show active' role='tabpanel'>" +
                    "<div class='row' style='margin-bottom: 10px;' id='accordion0'>" +
                    "<div id='C0' class='card'>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }

            if (i >= 2) {
                var x = i - 1;
                $("#tabNames").append("<li class='nav-item'>" +
                    "<a class='nav-link' data-toggle='pill' href='#tab" + x + "' role='tab'>" + categories[x] + "</a>" +
                    "</li>");
                $("#tabData").append("<div id='tab" + x + "' class='tab-pane fade' role='tabpanel'>" +
                    "<div class='row' style='margin-bottom: 10px;' id='accordion" + x + "'>" +
                    "<div id='C" + x + "' class='card'>" +
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
                var parentName = "";

                for (count = 0; count <= categories.length - 1; count++) {
                    if (faqCategory === categories[count]) {
                        tabName = '#C' + tabNum[count];
                        accordName = '#faq' + tabNum[count];
                        parentName = '#accordion' + count;
                        //alert(categories[count]+" : "+faqCategory + " : " + tabName);                    		
                    }
                }
            
                $(tabName).append("<a class='card-link accordion-toggle' data-toggle='collapse' data-parent=" + accordName + " href='#section" + ID + "'>" +
                    "<div class='card-header faqQuestion'>" +
                    "<strong>" + faqQuestion + "</strong>" +
                    "</div>" +
                    "</a>" +
                    "<div id='section" + ID + "' class='collapse faqAnswer' data-parent='"+parentName+"'> " +
                    "<div class='card-body'>" +
                    "<blockquote>" + faqAnswer + "</blockquote>" +
                    "</div>" +
                    "</div>");
            });
        }
    });
}