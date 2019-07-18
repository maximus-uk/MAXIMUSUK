function getGroupID(url, team, site, level, idLink) {

    var groupName = team + " " + level;
    var a = document.getElementById(idLink);
    var groupCollection = context.get_web().get_siteGroups();
    var group = groupCollection.getByName(groupName);

    context.load(group);

    context.executeQueryAsync(
        function () {
            var membershipGroupId = group.get_id();
            var groupURL = url + "/_layouts/15/people.aspx?MembershipGroupId=" + membershipGroupId;
            a.href = groupURL;

            //$(idLink).append("<a href='" + siteURL + "/_layouts/15/people.aspx?MembershipGroupId=" + membershipGroupID + "' alt='edit group' target='_blank'>" +
            //                 "<span class='glyphicon glyphicon-pencil'></span>" + level + "</a>");	            
        },
        function (sender, args) {
            console.log('Error\n' + args.get_message());
        }
    );
};