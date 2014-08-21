var Sample = function (widget) {
    this.widget = widget;
    this.$widget = $(widget.body);
};

Sample.prototype.init = function () {
    console.log("works!");
};