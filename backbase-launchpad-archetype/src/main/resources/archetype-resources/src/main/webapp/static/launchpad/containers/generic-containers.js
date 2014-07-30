/*global b$*/
b$.module("b$.portal.view.bdom.container.original", function () {
    "use strict";
    var Class = b$.require('b$.Class');
    var DefaultView = b$.require("b$.portal.view.bdom.default");
    var NS = DefaultView.NS;
    var Container = NS.classes.container;
    var LaunchpadManageableArea = NS.registerElement("LaunchpadManageableArea", Container.extend(function (bbDocument, namespaceURI, localName, node) {
        Container.call(this, bbDocument, namespaceURI, localName, node);
        this.isPossibleDragTarget = true;
    }, {
        buildDisplay: function () {

            return this.htmlNode;
        },
        readyHTML: function () {

            var self = this;
        }
    })
    );
});


/*global b$*/
b$.module("b$.portal.view.bdom.container.original", function () {
    "use strict";
    var Class = b$.require('b$.Class');
    var DefaultView = b$.require("b$.portal.view.bdom.default");
    var NS = DefaultView.NS;
    var Container = NS.classes.container;
    var TargetingWrapper = NS.registerElement("TargetingWrapper", Container.extend(function (bbDocument, namespaceURI, localName, node) {
        Container.call(this, bbDocument, namespaceURI, localName, node);
        this.isPossibleDragTarget = true;
    }, {
        buildDisplay: function () {

            return this.htmlNode;
        },
        readyHTML: function () {

            var self = this;
        }
    })
    );
});
