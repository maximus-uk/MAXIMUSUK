function openDialog(url, name, height, width, close) {
    if (close == undefined) { close = true };
    var options = SP.UI.$create_DialogOptions();
    options.url = url;
    options.height = height;
    options.width = width;
    options.title = name;
    options.showClose = close;
    options.showMaximized = false;
    options.dialogReturnValueCallback = function (dialogResult, value) {
        SP.UI.ModalDialog.RefreshPage(dialogResult);
        if (value == "1") { window.parent.location.reload(); return value; };
    };
    SP.UI.ModalDialog.showModalDialog(options);
};

/*function onClose(result,data) {
	switch (result) {
		case SP.UI.DialogResult.invalid:
			break;
		case SP.UI.DialogResult.cancel:
			break;
		case SP.UL.DialogResult.OK:
			window.parent.location.reload();
			break;	
	};
};*/

function showDialog(URL, ID, project) {

    $("#dialog-modal")
        .html('<iframe style="border:0px" src="' + URL + '" width="1024px" height="1024px"></iframe>')
        .dialog({
            autoOpen: false,
            height: 1024,
            width: 1024,
            modal: true,
        });

    $('#dialog-modal').dialog("open");

    //window.open("" + URL + "",,"titlebar=no,toolbar=no,location=no,menubar=no,status=no,scrollbars=no,top=100,left=100,height=1024,width=1024");

    /*var $dialog = $('#' + ID)
        .html('<iframe style="border:0px" src="' + URL + '" width="1024px" height="1024px"></iframe>')
        .dialog({
            title: project,
            autoOpen: false,
            //dialogClass: 'dialog_fixed,ui-widget-header',
            modal: true,
            height: 1024,
            draggable: true,
            buttons: { "Ok": function () { $(this).dialog("close"); parent.loction.reload; } }
        });
    $dialog.dialog('open');*/
};

function popup(url, height, width, top, left) {
    console.log(url);
    var newWindow = window.open(url, '_blank', 'height=' + height + ',width=' + width + ',top=' + top + ',left=' + left + ',titlebar=no,toolbar=no,location=no,menubar=no,status=no,scrollbars=no');
    if (window.focus) { newWindow.focus() }
    return false;
};