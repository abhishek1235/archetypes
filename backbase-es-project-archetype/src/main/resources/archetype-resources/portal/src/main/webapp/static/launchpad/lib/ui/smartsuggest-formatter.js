define("launchpad/lib/ui/smartsuggest-formatter", [
	"launchpad/lib/ui/ui-module",
    "launchpad/lib/common/util",
	"launchpad/lib/i18n"], function(uiModule, util) {

    "use strict";

    uiModule.factory("SmartSuggestFormatter", ["SmartSuggestEngine", "i18nUtils", function(SmartSuggestEngine, i18nUtils) {

        /**
         *
         * @param locale
         * @constructor
         */
        var SmartSuggestFormatter  = function(options) {

            this.locale = options.locale || null;
            this.currency = options.currency || null;
        };

        /**
         *
         */
        SmartSuggestFormatter.prototype.format = function(suggestion) {

            var values = [];

            if(suggestion.displayAsRange) {
                values[0] = this.formatValue(suggestion.search.from, suggestion.type);
                values[1] =  this.formatValue(suggestion.search.to, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.DATE) {
                values[0] = this.formatValue(suggestion.search.from, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.AMOUNT) {
                values[0] = this.formatValue(suggestion.search.original, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.CONTACT) {
                values[0] = this.formatValue(suggestion.contact.name, suggestion.type);
                values[1] = this.formatValue(suggestion.contact.account, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.ACCOUNT) {
                values[0] = this.formatValue(suggestion.account.name, suggestion.type);
                values[1] = this.formatValue(suggestion.account.iban, suggestion.type);
                values[2] = this.formatAmount(suggestion.account.balance, suggestion.account.currency);
            } else if(suggestion.type === SmartSuggestEngine.types.TITLE) {
                values[0] = this.formatValue(suggestion.title, suggestion.type);
            } else {
                values[0] = this.formatValue(suggestion.search.query, suggestion.type);
            }

            values = values.map(function(value) {
                return util.stripHtml(value);
            });

            return values;
        };

        /**
         *
         * @param value
         * @param type
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatValue = function(value, type) {

            var formattedValue;

            switch(type) {
                case SmartSuggestEngine.types.DATE:
                    formattedValue = this.formatDate(value);
                    break;
                case SmartSuggestEngine.types.AMOUNT:
                    formattedValue = this.formatAmount(value);
                    break;
                case SmartSuggestEngine.types.CONTACT:
                    formattedValue = this.formatGeneral(value);
                    break;
                case SmartSuggestEngine.types.CATEGORY:
                    //formattedValue = this.formatCategory(value);
                    break;
                case SmartSuggestEngine.types.TITLE:
                    formattedValue = this.formatTitle(value);
                    break;
                default:
                    formattedValue = this.formatGeneral(value);
            }
            return formattedValue;
        };

        /**
         *
         * @param value
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatDate = function(value) {

            //TODO: better i18n on the date format
            var dateFormat = "dd MMM yyyy";
            var formattedDate = i18nUtils.formatDate(this.currency, value, {
                format: dateFormat
            });

            return formattedDate;
        };

        /**
         *
         * @param value
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatAmount = function(value, currency) {

            //TODO: currency and locale hard coded
            var formattedAmount = i18nUtils.formatAmount("en-US", value, currency || this.currency);
            return formattedAmount;
        };

        SmartSuggestFormatter.prototype.formatAccount = function(value) {
            return value.name;
        };

        /**
         *
         * @param value
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatGeneral = function(value) {

            return value;
        };

        SmartSuggestFormatter.prototype.formatTitle = function(value) {
            switch (value) {
                case SmartSuggestEngine.types.ACCOUNT:
                    return "My accounts";
                case SmartSuggestEngine.types.CONTACT:
                    return "Address Book";
            }
            return value;
        };

        /**
         *
         * @param suggestion
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.getTypeLabel = function(suggestion) {

            var label;

            if(suggestion.type === SmartSuggestEngine.types.DATE && suggestion.displayAsRange) {
                label = "Between: ";
            } else if(suggestion.type === SmartSuggestEngine.types.AMOUNT && suggestion.displayAsRange) {
                label = "Between: ";
            } else if(suggestion.type === SmartSuggestEngine.types.DATE ) {
                label = "On: ";
            } else if(suggestion.type === SmartSuggestEngine.types.AMOUNT) {
                label = "Of: ";
            } else if(suggestion.type === SmartSuggestEngine.types.CONTACT) {
                label = "Contact: ";
            } else if(suggestion.type === SmartSuggestEngine.types.ACCOUNT) {
                label = "Account: ";
            } else if(suggestion.type === SmartSuggestEngine.types.TITLE) {
                label = "";
            } else {
                label = "Description: ";
            }
            return label;
        };

        /**
         *
         * @param suggestion
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.getSuggestionIcon = function(suggestion) {

            var iconClass;

            if(suggestion.type === SmartSuggestEngine.types.DATE ) {
                iconClass = "lp-icon lp-icon-medium lp-icon-calendar";
            } else if(suggestion.type === SmartSuggestEngine.types.AMOUNT) {
                iconClass = "lp-icon lp-icon-medium lp-icon-transactions-v1";
            } else {
                iconClass = "lp-icon lp-icon-medium lp-icon-search2";
            }
            return iconClass;
        };

        /**
         *
         * @param suggestion
         * @returns {string}
         */
        SmartSuggestFormatter.prototype.getSuggestionHtml = function(suggestion) {

            var htmlClass = "lp-smartsuggest-" + suggestion.type;
            var values = this.format(suggestion);

            var html = "<div class='lp-smartsuggest-result clearfix " + htmlClass + "'>";
            var predictedClass = suggestion.predicted ? "lp-smartsuggest-predicted" : "";

            //image
            if(suggestion.type !== SmartSuggestEngine.types.ACCOUNT && suggestion.type !== SmartSuggestEngine.types.TITLE){
                html += "<span class='lp-smartsuggest-icon'>";
                if(suggestion.type === SmartSuggestEngine.types.CONTACT && typeof suggestion.contact.photoUrl === "string") {
                    html += "<img src='" + decodeURIComponent(suggestion.contact.photoUrl) + "' width=35 height=35>";
                } else if(suggestion.type === SmartSuggestEngine.types.CONTACT && suggestion.contact.initials) {
                    html += "<span class='lp-smartsuggest-intials'>" + suggestion.contact.initials + "</span>";
                } else {
                    var iconClass = this.getSuggestionIcon(suggestion);
                    html += "<i class='" + iconClass + "'></i>";
                }
                html += "</span>";
            }

            html += "<div class='lp-smartsuggest-valuegroup'>";
            if(!suggestion.contact && !suggestion.account) {
                html += "<span class='lp-smartsuggest-category'>" + this.getTypeLabel(suggestion) + "</span>";
            }
            //formatting for contacts
            if(suggestion.contact) {
                html += "<span class='lp-smartsuggest-value " + htmlClass + "-value'>" + values[0] + "</span><br>";
                html += "<span class='" + htmlClass + "-value'>" + values[1] + "</span>";
            } else if (suggestion.account) {
                html += "<div class='lp-smartsuggest-value " + htmlClass + "-value'>" + values[0] + "</div>";
                html += "<div><small class='" + htmlClass + "-value pull-left muted'>" + values[1] + "</small>";
                html += "<span class='" + htmlClass + "-value pull-right'>" + values[2] + "</span></div>";
            }
            //formatting for ranges
            else if(values.length === 2) {
                html += "<span class='lp-smartsuggest-from lp-smartsuggest-value " + htmlClass + "-value'>" + values[0] + "</span> to ";
                html += "<span class='lp-smartsuggest-to lp-smartsuggest-value " + htmlClass + "-value " + predictedClass + "'>" + values[1] + "</span>";

                //formatting for single values
            } else {
                html += "<span class='lp-smartsuggest-value " + htmlClass + "-value'>" + values[0] + "</span>";
            }
            html += "</div>";
            html += "</div>";

            return html;
        };

        return SmartSuggestFormatter;
    }]);
});
