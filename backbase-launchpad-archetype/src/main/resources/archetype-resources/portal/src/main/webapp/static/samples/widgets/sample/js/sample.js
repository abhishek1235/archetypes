define(["jquery"], function ($) {
    "use strict";


    var Sample = function (widget) {
        this.widget = widget;
        this.$widget = $(widget.body);
    };



    Sample.prototype.init = function () {
        var self = this,
            url = window.location.href;

        console.log("works!");
    };

    return function(widget) {
        var widgetWrapper = new Sample(widget);
        widgetWrapper.init();
        return widgetWrapper;
    };
});
