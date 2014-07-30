/**
 * Created by david on 3/5/14.
 */
define("launchpad/lib/ui/input-overflow", [
    "angular",
    "jquery",
    "launchpad/lib/ui/ui-module"
    ], function(angular, $, uiModule) {

    "use strict";


    uiModule.directive("lpInputOverflow", [function () {

        return {
            restrict : "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModelCtrls) {

                var $elipsis, $indicator, $span;

                var initialize = function() {

                    element.wrap("<div class='lp-input-overflow'></div>");

                    //Create extra HTML elements needed
                    $elipsis = $(document.createElement("span"));
                    $elipsis.text("...");
                    $elipsis.addClass("lp-input-overflow-elipsis");

                    $indicator = $(document.createElement("div"));
                    $indicator.addClass("lp-input-overflow-indicator");
                    $indicator.append($elipsis);
                    element.after($indicator);

                    $span = $(document.createElement("span"));
                    $span.addClass("lp-input-overflow-input-text");
                    $span.text(ngModelCtrls.$modelValue);
                    //set the font size of the span to the same as the input so we can be assured of an accurate width comparison
                    $span.css("font-size", element.css("font-size"));
                    element.after($span);

                    //Set up event listeners
                    element.on("blur", showIndicator);
                    element.on("click", hideIndicator);
                    element.on("focus", hideIndicator);
                    $indicator.on("click", hideIndicator);


                };

                var showIndicator = function() {

                    $span.text(ngModelCtrls.$modelValue);

                    var textWidth = $span.width();
                    var inputWidth = element.width();

                    if(textWidth > inputWidth) {
                        $indicator.show();
                    } else {
                        $indicator.hide();
                    }
                };

                var hideIndicator = function() {

                    if($indicator.css("display") === "block") {
                        $indicator.hide();
                        element.focus();
                    }
                };


                initialize();
            }
        };
    }]);
});
