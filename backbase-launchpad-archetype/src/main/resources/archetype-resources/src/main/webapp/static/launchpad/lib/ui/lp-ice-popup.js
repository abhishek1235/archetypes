/*global bd, be, $*/

(function(window, $) {

    "use strict";

    var DEFAULTTEMPLATE = "$(contextRoot)/static/launchpad/html/content/popup-content.html";

    var Icepopup = function(gadget){
        this.gadget = gadget;
        this.id = gadget.id + '_icepopup';
        this.templateUrl = String(gadget.getPreference('templateUrl')? gadget.getPreference('templateUrl'):DEFAULTTEMPLATE);
        this.gadget.iceConfig = be.ice.config;
    };

    Icepopup.prototype.render = function () {
        if (be && be.ice && be.ice.controller) {
            return be.ice.controller.render(this.gadget, this.templateUrl)
                .then(function(dom) {
                    this.content = dom;
                    $(this.gadget.body).append(dom);
                    return dom;
                });
        }
    };

    Icepopup.prototype.edit = function () {
        if (be && be.ice && be.ice.controller) {
            if(this.templateUrl.match(/\/image\.html$/)){
                this.templateUrl = this.templateUrl.replace(/\/image\.html$/, '/image-editorial.html');
            }
            return be.ice.controller.edit(this.gadget, this.templateUrl)
                .then(function(dom) {
                    $(this.gadget.body).append(dom);
                    this.content = dom;
                    return dom;
                });
        }
    };

    Icepopup.prototype.open = function () {
        if (this.content) {
            $(this.content).show();
        }
        if (bd && bd.designMode === 'true'){
            this.edit();
        } else {
            this.render();
        }
        var setPostion = function (element) {
            var top = ($(document).height()/2) - ($(element).height()/2);
            var left = ($(document).width()/2) - ($(element).width()/2);
            $(element).css({
                top: top,
                left:left
            });
        };
        setPostion(this.content);
        $(this.content).show();
    };

    Icepopup.prototype.close = function () {
        if(this.content) {
            $(this.content).hide();
        }
    };
})(window, $);