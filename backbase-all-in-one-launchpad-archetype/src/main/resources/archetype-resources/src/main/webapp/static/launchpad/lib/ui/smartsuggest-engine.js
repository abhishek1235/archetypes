define("launchpad/lib/ui/smartsuggest-engine",
	["launchpad/lib/ui/ui-module",
	"launchpad/lib/common/util",
	"launchpad/support/date"], function(uiModule, util) {

	"use strict";

	var RANGE_REGEX = /^(.+)\sto\s?(.*)$/i;

	var NUMBER_REGEX = /[\-+]?([0-9]*\.)?[0-9]+/;

	var STRIP_ACC_FORMATTING_REGEX = /[\.+\s+\-]/g;

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// The SmartSearch class
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var SmartSuggest = function(options) {
        this.options = options || {};
		this.suggesters = [];
	};

	/**
	 * Returns a list of suggestions for a search
	 * @param term
	 * @returns {Array}
	 */
	SmartSuggest.prototype.getSuggestions = function(term) {

        var self = this;

		//escape html
		term = util.stripHtml(term);

		//leave early if the term is an invalid type
//		if(!term || typeof term !== "string") {
//			return [];
//		}

		//single value or "value to value" range
		var terms = [];
		if(SmartSuggest.util.isRange(term)) {
			terms = term.match(RANGE_REGEX);
		} else {
			terms[1] = term;
		}

		//iterate through suggesters accumulating suggestion results
		var suggestions = [];
		this.suggesters.forEach(function(suggester) {
			var newSuggestions = suggester.suggest.call({
				data: suggester.data || null,
				type: suggester.type,
                options: suggester.options || {}
			}, terms[1], terms[2]);
            if (self.options.showTitles && newSuggestions.length > 0) {
                suggestions = suggestions.concat({
                    type: SmartSuggest.types.TITLE,
                    title: suggester.type
                });
            }
			suggestions = suggestions.concat(newSuggestions);
		});

		return suggestions;
	};

	/**
	 * Adds a suggester. Can be a built in or custom function
	 * @param suggester
	 */
	SmartSuggest.prototype.addSuggester = function(suggester) {

		//overwrite existing suggesters of the same type
		var replaced = false;
		for(var i = 0; i < this.suggesters.length && !replaced; i++) {
			if(this.suggesters[i].type === suggester.type) {
				this.suggesters[i] = suggester;
				replaced = true;
			}
		}
		if(!replaced) {
			this.suggesters.push(suggester);
		}

		return this;
	};

	/**
	 * Remove all currently registererd suggester functions
	 */
	SmartSuggest.prototype.clearSuggesters = function() {

		this.suggesters = [];
	};


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Built in suggestion generators
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	SmartSuggest.types = {
		DATE: "date",
		AMOUNT: "amount",
        ACCOUNT: "account",
		CONTACT: "contact",
		CATEGORY: "category",
		GENERAL: "general",
        TITLE: "title"
	};

	SmartSuggest.builtIn = {};

	/**
	 * Attempts to parse a date from the supplied term and returns date oriented search suggestions
	 * @param term
	 * @returns {Array}
	 */
	SmartSuggest.builtIn.getDateSuggestions = function(term1, term2) {

		var suggestions = [];

		var from = SmartSuggest.util.parseDate(term1);
		var to = SmartSuggest.util.parseDate(term2);

		//if user this is not a displayAsRange search, i.e. search on specific day or month, "July"
		if(from && !to) {
			to = SmartSuggest.util.makeToDateInclusive(term1, from);
			suggestions.push({
				terms: [term1, term2],
				type: this.type || SmartSuggest.types.DATE,
				displayAsRange: false,
				search: {
					from: from,
					to: to
				}
			});
		}

		var predicted = false;
		//always provide a range suggestion (predicted or user specified)
		if(from) {
			if(!term2 || (to && from.getTime() > to.getTime())) {
				to = SmartSuggest.util.predictToDate(term1, from);
				predicted = true;
			} else {
				to = SmartSuggest.util.makeToDateInclusive(term2, to);
			}
			if(from.getTime() < to.getTime()) {
				suggestions.push({
					terms: [term1, term2],
					type: this.type,
					displayAsRange: true,
					predicted: predicted,
					search: {
						from: from,
						to: to
					}
				});
			}
		}
		return suggestions;
	};

	/**
	 * Attempts to parse am amount from the supplied term(s)
	 * @param term
	 * @returns {Array}
	 */
	SmartSuggest.builtIn.getAmountSuggestions = function(term1, term2) {

		var suggestions = [];

		var from = SmartSuggest.util.parseAmount(term1);
		var to = SmartSuggest.util.parseAmount(term2);

		//if user this is not a range search, make it a fuzzy range
		if(from && !to) {
			var fuzzyRange = SmartSuggest.util.makeNumberFuzzy(from);
			suggestions.push({
				terms: [term1, term2],
				type: this.type || SmartSuggest.types.AMOUNT,
				displayAsRange: false,
				search: {
					original: from,
					from: fuzzyRange.from,
					to: fuzzyRange.to
				}
			});
		}

		var predicted = false;
		//always provide a range suggestion (predicted or user specified)
		if(from) {
			//if it is a range suggestion predict the to number
			if(!term2 || (to && from > to)) {
				to = SmartSuggest.util.predictToAmount(from);
				predicted = true;
			}
			if(from < to) {
				suggestions.push({
					terms: [term1, term2],
					type: this.type,
					displayAsRange: true,
					predicted: predicted,
					search: {
						from: from,
						to: to
					}
				});
			}
		}
		return suggestions;
	};

    SmartSuggest.builtIn.getAccountSuggestions = function(term){
        var self = this,
            suggestions = [],
            accounts = this.data || [];

        if(term.length < 2 && !this.options.showAll) {
            return suggestions;
        }

        accounts.forEach(function(account) {

            var nameRegex = new RegExp("(" + term + ")", "ig");
            var nameMatch = account.name.match(nameRegex);
            var bbanMatch = false;

            if(!nameMatch) {
                var unformattedTerm = term.replace(STRIP_ACC_FORMATTING_REGEX, "");
                var accountRegex = new RegExp("^(" + unformattedTerm + ")", "i");
                bbanMatch = (account.bban + "").match(accountRegex);
            }
            if((term.length < 2 && self.options.showAll) || nameMatch || bbanMatch) {
                suggestions.push({
                    terms: [ term ],
                    type: self.type || SmartSuggest.types.ACCOUNT,
                    matchType: bbanMatch ? "number" : "name",
                    account: account,
                    search: {
                        account: account.id
                    }
                });
            }
        });

        return suggestions;
    };

	/**
	 *
	 * @param term
	 */
	SmartSuggest.builtIn.getContactSuggestions = function(term) {

		var self = this;
		var suggestions = [];

		if(term.length < 2 && !this.options.showAll) {
			return suggestions;
		}

		var contacts = this.data || [];
		contacts.forEach(function(contact) {

			var nameRegex = new RegExp("(" + term + ")", "ig");
			var nameMatch = contact.name.match(nameRegex);
			var accountMatch = false;
			if(!nameMatch) {
				var unformattedTerm = term.replace(STRIP_ACC_FORMATTING_REGEX, "");
				var accountRegex = new RegExp("^(" + unformattedTerm + ")", "i");
				accountMatch = (contact.account + "").match(accountRegex);
			}
			if((term.length < 2 && self.options.showAll) || nameMatch || accountMatch) {
				suggestions.push({
					terms: [ term ],
					type: self.type || SmartSuggest.types.CONTACT,
					matchType: accountMatch ? "account" : "name",
					contact: contact,
					search: {
						contact: contact.account
					}
				});
			}
		});

		return suggestions;
	};

	/**
	 *
	 * @param term
	 */
	SmartSuggest.builtIn.getCategorySuggestions = function(term) {
		//TODO: implement me
	};

	/**
	 *
	 * @param term
	 * @returns {Array}
	 */
	SmartSuggest.builtIn.getGeneralSuggestions = function(term1, term2) {

		var suggestions = [];

		var term = term2 ? term1 + " to " + term2 : term1;

		if(term.length >= 2) {
			if(!SmartSuggest.util.isRange(term)) {
				suggestions.push({
					terms: [ term ],
					type: this.type || SmartSuggest.types.GENERAL,
					search: {
						query: term
					}
				});
			}
		}

		return suggestions;
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Utilities
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	SmartSuggest.util = {};

	/***
	 *
	 * @param term
	 * @returns {boolean}
	 */
	SmartSuggest.util.isRange = function(term) {

		return RANGE_REGEX.test(term);
	};

	/**
	 * Special number parser for amounts
	 * @param toParse
	 * @returns {null}
	 */
	SmartSuggest.util.parseAmount = function(toParse) {

		var num = null;
		if(toParse) {
			var parseResult = toParse.match(NUMBER_REGEX);
			if(parseResult && parseResult.length) {
				num = parseFloat(parseResult[0]);
			}
		}

		return !isNaN(num) ? Math.abs(num) : null;
	};

	/**
	 * Return false if if the date is not a 4 digit numeric value between 1900 and 2100 otherwise returns the
	 * parsed year
	 * @param toParse
	 * @returns {*}
	 */
	SmartSuggest.util.isYearDate = function(toParse) {

		var year = SmartSuggest.util.parseAmount(toParse);
		return !isNaN(year) && year > 1900 && year < 2100 ? year : false;
	};

	/**
	 * Parses a date, with special rules for auto suggestions
	 * @param toParse
	 * @returns {*}
	 */
	SmartSuggest.util.parseDate = function(toParse) {

		var parsedDate;
		var year = SmartSuggest.util.isYearDate(toParse);
		var number = parseFloat(toParse);
		if(year) {
			parsedDate = new Date(year, 0, 1);
		} else if(isNaN(number) || number <= 31) {
			parsedDate =  toParse ? Date.parse(toParse) : null;
		}
		return parsedDate;
	};

	/**
	 *
	 * @param term
	 * @returns {*}
	 */
	SmartSuggest.util.getDateTermSpecificity = function(term) {

		var specificity;
		var regexPatterns = Date.CultureInfo.regexPatterns;

		//add year
		var year = SmartSuggest.util.isYearDate(term);

		//add a month
		var month =
			!year &&
				(term.match(regexPatterns.jan) ||
					term.match(regexPatterns.feb) ||
					term.match(regexPatterns.mar) ||
					term.match(regexPatterns.apr) ||
					term.match(regexPatterns.may) ||
					term.match(regexPatterns.jun) ||
					term.match(regexPatterns.jul) ||
					term.match(regexPatterns.aug) ||
					term.match(regexPatterns.sep) ||
					term.match(regexPatterns.oct) ||
					term.match(regexPatterns.nov) ||
					term.match(regexPatterns.dec) !== null);

		if(year) {
			specificity = "year";
		} else if(month) {
			specificity = "month";
		} else {
			specificity = "day";
		}

		return specificity;
	};

	/**
	 * Makes a date, inclusive specific to milliseconds.
	 * E.g. Thursday will be converted to 1 millisecond before midnight Friday
	 * @param term
	 * @param date
	 * @returns {*}
	 */
	SmartSuggest.util.makeToDateInclusive = function(term, date) {

		var dateSpecificity = SmartSuggest.util.getDateTermSpecificity(term);

		var timeToAdd;
		if(dateSpecificity === "year") {
			timeToAdd = { years : 1 };
		} else if(dateSpecificity === "month") {
			timeToAdd = { months : 1 };
		} else {
			timeToAdd = { days : 1 };
		}

		var inclusiveDate = date.clone().add(timeToAdd).addMilliseconds(-1);

		return inclusiveDate;
	};

	/**
	 * Util for suggesting a to amount if a user types a single amount
	 * @param from
	 * @returns {number}
	 */
	SmartSuggest.util.predictToDate = function(term, from) {

		var dateSpecificity = SmartSuggest.util.getDateTermSpecificity(term);

		var timeToAdd;
		if(dateSpecificity === "year") {
			timeToAdd = { years : 1 };
		} else if(dateSpecificity === "month") {
			timeToAdd = { months : 1 };
		} else {
			timeToAdd = { weeks : 1 };
		}

		var predictedDate = from.clone().add(timeToAdd).addMilliseconds(-1);

		return predictedDate;
	};

	/**
	 * Util for creating a fuzzy range search from a single amount
	 * @param from
	 * @returns {{from: number, to: number}}
	 */
	SmartSuggest.util.makeNumberFuzzy = function(from) {

		var deviation = (from / 10) / 2;
		var fuzzy = {
			from: Math.floor(from - deviation),
			to: Math.ceil(from + deviation)
		};

		return fuzzy;
	};

	/**
	 * Util for suggesting a to amount if a user types a single amount
	 * @param from
	 * @returns {number}
	 */
	SmartSuggest.util.predictToAmount = function(from) {

		var to = Math.ceil(from + (from / 2));
		return to;
	};

	//export
	uiModule.factory("SmartSuggestEngine", function() {
		return SmartSuggest;
	});

    return SmartSuggest;
});
