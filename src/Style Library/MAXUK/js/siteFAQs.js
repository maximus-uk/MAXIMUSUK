var categories = [];
var tabNum = [];

function getFAQTabs(siteURL) {

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
        for (var i = 0; i < categories.length; i++) {

            if (i === 0) {
                $("#tabNames").append(
                    "<a class='nav-link active show' data-toggle='tab' href='#faqtab"+i+"' role='tab'>" + categories[0] + "</a>");
                    //"<li class='nav-item'>" +"</li>");
                $("#tabData").append("<div id='faqtab"+i+"' class='tab-pane fade active show faqAnswersAccordion' role='tabpanel'>" +
                    "<div class='row' style='margin-bottom: 10px;' id='faq"+i+"'>" +
                    "<div id='C"+i+"' class='card'>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }

            if (i >= 1) {
                //var x = i - 1;
                $("#tabNames").append(
                    "<a class='nav-link' data-toggle='pill' href='#faqtab" + i + "' role='tab'>" + categories[i] + "</a>");
                    //"<li class='nav-item'>" +"</li>");
                $("#tabData").append("<div id='faqtab" + i + "' class='tab-pane fade faqAnswersAccordion' role='tabpanel'>" +
                    "<div class='row' style='margin-bottom: 10px;' id='faq" + i + "'>" +
                    "<div id='C" + i + "' class='card'>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
            }
        }
    }
}

function getFAQItems(siteURL) {

    var method = "GetListItems";
    var list = "FAQs";
    var url = siteURL + "/";
    var fields = "<ViewFields>" +
        "<FieldRef Name='ID' />" +
        "<FieldRef Name='Question' />" +
        "<FieldRef Name='Category' />" +
        "<FieldRef Name='Answer' />" +
        "</ViewFields>";
    var count;

    $().SPServices({
        operation: method,
        async: false,
        webURL: url,
        listName: list,
        CAMLViewFields: fields,
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                // assign SP list item
                var ID = ($(this).attr("ows_ID"));
                var faqQuestion = ($(this).attr("ows_Question"));
                var faqCategory = ($(this).attr("ows_Category"));
                var faqAnswer = ($(this).attr("ows_Answer"));
                var tabName = "";
                var accordName = "";

                for (count = 0; count < categories.length; count++) {
                    if (faqCategory === categories[count]) {
                        tabName = '#C' + tabNum[count];
                        accordName = '#faq' + tabNum[count];
                        console.log(tabName);
                        //parentName = '#accordion' + count;
                        //alert(categories[count]+" : "+faqCategory + " : " + tabName);                    		
                    }
                }
            
                $(tabName).append("<a class='card-link accordion-toggle' data-toggle='collapse'  href='#section" + ID + "'>" +
                    "<div class='card-header faqQuestion'>" +
                    "<strong>" + faqQuestion + "</strong>" +
                    "</div>" +
                    "</a>" +
                    "<div id='section" + ID + "' class='collapse' data-parent=" + accordName + ">" +
                    "<div class='card-body'>" +
                    "<blockquote>" + faqAnswer + "</blockquote>" +
                    "</div>" +
                    "</div>");
            });
        }
    });
}