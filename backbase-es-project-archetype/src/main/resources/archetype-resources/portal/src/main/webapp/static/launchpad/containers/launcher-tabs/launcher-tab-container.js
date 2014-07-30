/*global b$, bd, be, jQuery, Mustache*/

(function (window, b$, bd, be, $, Mustache) {

    "use strict";

    // Register Launcher Tab Container in Namespace
    var NS = b$.bdom.getNamespace('http://backbase.com/2012/portalView'),
        Tab = NS.getClass('Tab'),
        tabContainerDesignMode = be.utils.module("be.tabContainer.designMode");

    /**
     * @class LauncherTabContainer
     * @extends Tab
     * Extend the Tab and create the Launcher Tab container
     */
     NS.registerElement('LauncherTabContainer', Tab.extend(null,{
         /* local variable */
     },{}));

    /**
     * @method enableDesignMode
     * Enable the edit tool bar for the tabContainer and it's children
     */
    tabContainerDesignMode.enableDesignMode = function() {
        if (!this.designMode) {
            this.designMode = true;
            this.showDesignTools();
        }
        var aChildren = this.childNodes;
        for (var i = 0; i < aChildren.length; i++) {
            aChildren[i].designMode = true;
            if(aChildren[i].enableDesignMode) {
                aChildren[i].enableDesignMode();
            }
        }
    };

    /**
     * @method disableDesignModeForChildren
     * Overwrite tab container disableDesignModeForChildren functions.
     */
    tabContainerDesignMode.disableDesignModeForChildren = function () {};

})(window, b$, bd, be, jQuery, Mustache);
