(function () {
    var overrideContext = {};
    overrideContext.Templates = {};
    overrideContext.Templates.Fields = { 'Target_x002f_Actual': { 'View': GetTarget } };
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
})();

function GetTarget(ctx) {
    var ST = ctx.CurrentItem.Target_x002f_Actual;
    if (ST == 'Difference(+/-)') {
        return "<span style='width=1000px;'><font style='font-weight:bold;display:block;'>" + ctx.CurrentItem.Target_x002f_Actual + "</font></span>";
    }
    else {
        return ctx.CurrentItem.Target_x002f_Actual
    }
}
