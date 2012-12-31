(function() {
    var widget = util.xmlToDom(<label xmlns={XUL} class="plain" key="size" id="dactyl-statusline-field-size" value="" flex="0"/>, document);
    statusline.widgets.zoomlevel.parentNode.insertBefore(widget, statusline.widgets.zoomlevel);
    commandline.widgets.addElement({
        name: "size",
        getGroup: function () this.statusbar,
        getValue: function () statusline.visible,
        noValue: true
    });
    commandline.widgets.updateVisibility();

    const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
    var myListener = {
        onLocationChange: function (webProgress, request, uri) {
            widget.value = "[w=" + gBrowser.mCurrentBrowser.contentDocument.body.scrollWidth + ",h=" + gBrowser.mCurrentBrowser.contentDocument.body.scrollHeight + "]";
        },

        onStateChange: function onStateChange(awebProgress, aRequest, aFlag, aStatus) {
            if (aFlag & STATE_STOP) {
                widget.value = "[w=" + gBrowser.mCurrentBrowser.contentDocument.body.scrollWidth + ",h=" + gBrowser.mCurrentBrowser.contentDocument.body.scrollHeight + "]";
            }
        }
    };

    gBrowser.addProgressListener(myListener);
})();        
