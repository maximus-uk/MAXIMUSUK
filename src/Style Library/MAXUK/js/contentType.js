// JavaScript source code
var defaultContentTypes = [
    { ListTitle: 'Documents', ContentTypeId: '0x0120D52000892F35E5C8DCCC40A8177A0DDFA0BC4400C5C87DBA25630845AD320DA5A1E35DF9', ContentTypeName: 'Bravo' },
    { ListTitle: 'Accounts', ContentTypeId: '0x0101005C18A4FC55B2C84FB8DD5E5A71D1DA02000529316EC50BA14CB28D9E8D69BA43B4', ContentTypeName: '' }
];

var context;

function setDefaultContentType() {
    context = SP.ClientContext.get_current();
    _.each(defaultContentTypes, function (current) {
        var rootFolder = context.get_web().get_lists().getByTitle(current.ListTitle).get_rootFolder();
        var contentTypes = context.get_web().get_lists().getByTitle(current.ListTitle).get_contentTypes();

        context.load(rootFolder, 'ContentTypeOrder', 'UniqueContentTypeOrder');
        context.load(contentTypes);
    });

    context.executeQueryAsync(loadContentTypesSuccess, onScriptFailure);
};

function loadContentTypesSuccess() {
    _.each(defaultContentTypes, function (current) {
        var originalCTO;
        var rootFolder = context.get_web().get_lists().getByTitle(current.ListTitle).get_rootFolder();
        var contentTypes = context.get_web().get_lists().getByTitle(current.ListTitle).get_contentTypes();
        originalCTO = rootFolder.get_contentTypeOrder();

        var newCTO = new Array();
        var contentTypeEnum = contentTypes.getEnumerator();
        while (contentTypeEnum.moveNext()) {
            var currentCT = contentTypeEnum.get_current();
            if (currentCT.get_name().toLowerCase() === 'folder')
                continue;

            if (currentCT.get_name().toLowerCase() === current.ContentTypeName.toLowerCase()) {
                newCTO.splice(0, 0, currentCT.get_id());
                continue;
            }

            for (i = 0; i < originalCTO.length; i++) {
                if (originalCTO[i].toString() == currentCT.get_id().toString()) {
                    newCTO.push(currentCT.get_id());
                    break;
                }
            }
        }

        rootFolder.set_uniqueContentTypeOrder(newCTO);
        rootFolder.update();
    });
    context.executeQueryAsync(onUpdateContentTypes, onScriptFailure);
};

function onUpdateContentTypes() {
    alert('Updated Default ContentTypes');
};

function onScriptFailure(sender, args) {
    alert(args.get_message() + '\n' + args.get_stackTrace());
};