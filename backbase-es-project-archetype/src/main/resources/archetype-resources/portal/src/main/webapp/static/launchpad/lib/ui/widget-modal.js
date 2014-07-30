/*global bd, be, console*/
define("launchpad/lib/ui/widget-modal", [
    "angular",
    "jquery",
    "launchpad/lib/common/util",
    "launchpad/lib/ui/ui-module",
    "launchpad/support/angular/angular-ui-bootstrap"
], function(angular, $, util, uiModule) {
    'use strict';

    var TEMPLATE_PATH = util.getContextPath() + '/static/launchpad/lib/ui/templates/';

    var getIceContent = function (widget) {
        var _edit = function(widget){
            if (be && be.ice && be.ice.controller) {
                widget.iceConfig = be.ice.config;
                var templateUrl = String(widget.getPreference('templateUrl'));
                if(templateUrl.match(/\/image\.html$/)){
                    templateUrl = templateUrl.replace(/\/image\.html$/, '/image-editorial.html');
                }
                return be.ice.controller.edit(widget, templateUrl)
                    .then(function(dom) {
                        return dom;
                    });
            }
        };
        if (bd && bd.designMode === 'true'){
            return _edit(widget);
        }
    };

    uiModule.directive('modalDialog', ['widget', function(widget) {
        return {
            restrict: 'AE',
            scope: {
                show: '='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            templateUrl: TEMPLATE_PATH + 'lp-modal.html',
            link: function(scope, element, attrs) {
                scope.closable = attrs.closable ? scope.$parent.$eval(attrs.closable) : true;
                scope.dialogStyle = {};
                if (attrs.width) {
                    scope.dialogStyle.width = attrs.width;
                }
                if (attrs.height) {
                    scope.dialogStyle.height = attrs.height;
                }

                var bindCloseModal = function (){
                    $(element).find('.modal-close-button').on('click', function(){
                        scope.hideModal();
                        scope.$apply();
                    });
                };

                if (attrs.isice && widget.getPreference('templateUrl')) {
                    var c = getIceContent(widget);
                    if(c) {
                        c.then(function(dom) {
                            $(element).find('.bp-g-include').html(dom);
                            $(element).find('[contenteditable]').on('keypress keydown', function(e){
                                e.stopPropagation();
                            });
                            bindCloseModal();
                        });
                    } else {
                        bindCloseModal();
                    }
                }


                scope.hideModal = function () {
                    scope.show = false;
                };

                var escapeEvent = function (e) {
                    if (e.keyCode === 27) {
                        scope.hideModal();
                        scope.$apply();
                    }
                };
                scope.$watch("show", function(newValue) {
                    if (newValue) {
                        $(document).bind('keydown.modalDialog', escapeEvent);
                    } else {
                        $(document).unbind('keydown.modalDialog', escapeEvent);
                    }
                });
            }
        };
    }]);
});