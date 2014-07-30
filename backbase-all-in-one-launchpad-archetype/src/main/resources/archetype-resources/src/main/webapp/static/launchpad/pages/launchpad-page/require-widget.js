/*global requirejs require*/
(function(global, requirejs, require) {

    "use strict";

    /**
     * Utils function for cloning an object
     * @private
     * @param obj
     * @return {*}
     */
    var _clone = function(obj){
        if (obj === null || typeof(obj) !== 'object') {
            return obj;
        }

        var temp = obj.constructor(); // changed

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = _clone(obj[key]);
            }
        }

        return temp;
    };

    /**
     * Util function for shallow merging objects
     * @private
     * @param o1
     * @param o2
     * @return {*}
     */
    var _mergeObjects = function(o1, o2) {
        if (o1 === null || o2 === null) {
            return o1;
        }

        for (var key in o2) {
            if (o2.hasOwnProperty(key)) {
                o1[key] = o2[key];
            }
        }

        return o1;
    };

    /**
     * Gets and invokes widget function written as an AMD module
     *
     * @param {Object} localConfig Additional config for the internal require call
     * @param {Object} widgetInstance The instance of the widget created by portal (__WIDGET__)
     * @param {String} widgetModule The amd module that should return a function to handle the widget
     */
    var _requireWidget = function(localConfig, widgetInstance, widgetModule) {

	    //clone the require js config, don't want to modify the original
	    var widgetConfig = _clone(requirejs.s.contexts._.config);

        //work out correct widget module id
        var widgetBase = widgetInstance.myDefinition.sUrl.replace(/[^\/]*$/, '');
	    widgetBase = widgetBase.replace(new RegExp("^" + widgetConfig.baseUrl), '');
	    widgetModule = widgetBase + widgetModule;

        //update widget config to include any local shims or paths
        widgetConfig.shim = _mergeObjects(widgetConfig.shim, localConfig.shim);
        widgetConfig.paths = _mergeObjects(widgetConfig.paths, localConfig.paths);

        //require the widget module wrapped in a specific require context
        var widgetRequire = require.config(widgetConfig);
        widgetRequire([widgetModule], function(widgetFn) {

            if(typeof widgetFn === "function") {
                widgetFn.call(null, widgetInstance);
            }
        });
    };

    /**
     * Use in a g:onload for asynchronously loading AMD modules associated with widgets. This is a global function
     *
     * @author philip@backbase.com
     * @copyright Backbase B.V, 2013
     * @exports requireWidget
     *
     * @example
     * &lt;body g:onload="requireWidget(__WIDGET__, 'my-module')"&gt;
     *
     * @param {Object} localConfig Require JS config containing paths or shims to add to the global requirejs context before loading
     *                  this widget (Optional)
     * @param {Object} widgetInstance The widget (__WIDGET__) instance
     * @apram {String} module The name of the widget module to load
     */
    var requireWidget = function() {

        //parse args to figure out if extra require js config was passed
        var args = Array.prototype.slice.call(arguments, 0);
        if(!args[0].shim || args[1].paths) {
            //add an empty config object
            args.unshift({});
        }
        _requireWidget.apply(null, args);
    };

    global.requireWidget = requireWidget;

})(window, requirejs, require);
