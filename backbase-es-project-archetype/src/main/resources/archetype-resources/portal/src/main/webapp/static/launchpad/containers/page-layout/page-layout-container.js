/*global b$, $,lp,bd*/
(function() {

    "use strict";

    var NS = b$.bdom.getNamespace("http://backbase.com/2012/portalView");
    var Container = NS.classes.container;
    NS.registerElement("PageLayoutContainer", Container.extend(function(bbDocument, namespaceURI, localName, node) {

        Container.call(this, bbDocument, namespaceURI, localName, node);
        this.isPossibleDragTarget = true;
    }, {
        /**
         *
         * @param htmlElement
         * @returns {*}
         */
        buildDisplay: function(htmlElement) {

            this.$container = $(htmlElement);
            return Container.prototype.buildDisplay.call(this, htmlElement);
        },

        readyHTML: function () {

            return Container.prototype.readyHTML.call(this);
        }
    }));
})();
