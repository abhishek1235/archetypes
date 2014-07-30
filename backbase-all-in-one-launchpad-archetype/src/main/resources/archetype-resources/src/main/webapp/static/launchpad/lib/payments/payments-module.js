define("launchpad/lib/payments/payments-module",[
    "angular",
    "launchpad/lib/common",
    "launchpad/lib/ui/ui-module",
    "launchpad/lib/ui/input-overflow"
], function(angular) {
    "use strict";

    var module = angular.module("payments", ["common", "ui"]);

    module.value("pendingPaymentOrdersTimeout", 10 * 1000);
    module.value("customerId", "3");

    return module;
});
