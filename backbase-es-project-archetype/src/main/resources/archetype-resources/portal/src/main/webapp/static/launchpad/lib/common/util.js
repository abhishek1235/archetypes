/*jshint bitwise: false*/
/*global b$ jQuery bd console*/
(function(window, $) {

    "use strict";

    /**
     * Launchpad utility functions
     *
     * @exports util
     * @alias lp.util
     * @author philip@backbase.com
     * @copyright Backbase B.V, 2013
     *
     * @example
     * lp.util.isSmartphone();
     */
    var util = {};
    var lp = window.lp;

    /**
     * <p>Returns true if:
     * <ol>
     *  <li>the value is a boolean and true<br>
     *  <li>the value is a number and not 0<br>
     *  <li>the value is a string and equal to 'true' (after trimming and ignoring case)
     * </ol>
     * @memberOf util
     * @param {*} val The value to parse
     * @return {boolean} A boolean value depending on the parsing result
     */
    util.parseBoolean = function(val) {

        return (typeof val === "boolean" && val) ||
            (typeof val === "string" && /\s*true\s*/i.test(val)) ||
            (typeof val === "number" && val !== 0);
    };

    var bgImages = {};

    /**
     * Allows a widget or container to indirectly set the background image of a page
     * @param {string} imageSrc
     */
    util.setPageBackground = function(imageSrc) {

        var $main = $("#main");
        var $bg = bgImages[imageSrc];
        if(!$bg) {
            $bg = $("<div class=lp-full-bg />").css("background-image", "url(" + imageSrc + ")");
            $main.prepend($bg);
            bgImages[imageSrc] = $bg;
        }
        var $otherBgs = $main.children(".lp-full-bg").not($bg);
        $otherBgs.fadeOut(1000);
        $bg.fadeIn($otherBgs.length === 0 ? 0 : 1000);
    };
	
	util.showBackdrop = function(fadeDuration) {
		fadeDuration = fadeDuration || 200;
		$("#lp-page-backdrop").fadeTo(fadeDuration, 0.5);
	};

	util.hideBackdrop = function(fadeDuration) {
		fadeDuration = fadeDuration || 200;
		$("#lp-page-backdrop").fadeOut(fadeDuration);
	};

    /**
     * Returns true if the portal is running in design mode
     * @returns {boolean}
     */
    util.isDesignMode = function() {

        return util.parseBoolean(bd.designMode);
    };

	/**
	 * Safe way to get the context path
	 * @returns {*}
	 */
	util.getContextPath = function() {

		var contextPath = typeof b$ !== "undefined" ? b$.portal.config.serverRoot : "";
		return contextPath;
	};


	/**
	 * Safe way to get the context path
	 * @returns {*}
	 */
	util.getServicesPath = function() {

		var servicesPath;
		if(window.lp.servicesPath) {
			servicesPath = window.lp.servicesPath;
		} else {
			//Integration services path is not defined. Defaulting to portlserver context path
			servicesPath = util.getContextPath();
		}
		return servicesPath;
	};

    /**
     * Returns true if the portal is not running on a tablet or a smartphone
     * @returns {boolean}
     */
    util.isDesktop = function() {

        return !util.isTablet && !util.isSmartphone();
    };

    /**
     * Returns true if the tablet is running on a table device
     * @returns {boolean}
     */
    util.isTablet = function() {

        return $("html").hasClass("tablet");
    };

    /**
     * Returns true if the tablet is running on a table device
     * @returns {boolean}
     */
    util.isSmartphone = function() {

        return $("html").hasClass("smartphone");
    };

    util.getWidgetFromNode = function(widgetBody) {
        var widget = $(widgetBody).closest(".bp-widget")[0].viewController;
        return widget;
    };

    util.applyScope = function($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };



    /**
     * Replaces variables within a url. For example
     *
     * @example
     * ${contextPath}/profile
     * is merged with
     * {
     *    contextPath: "/portalserver"
     * }
     * and becomes /portalserver/profile
     *
     * @param url {String} A url possibly contain vars to replace
     * @param urlVars {Object} Map of replacement vars
     */
    util.replaceUrlVars = function(url, urlVars) {
        if(typeof url === "string") {
            for(var urlVar in urlVars) {
                if(urlVars.hasOwnProperty(urlVar)) {
                    var urlVarRegexp = new RegExp("\\$\\(" + urlVar + "\\)", "g");
                    url = url.replace(urlVarRegexp, urlVars[urlVar]);
                }
            }
        }

        return url;
    };

	util.findMatchingChildrenByTag = function(item, tagName) {

		var matchingChildren = [];
		if(item.childNodes) {
			matchingChildren = item.childNodes.filter(function(child) {

				var matchingTags = child.model.tags.filter(function(tag) {
					return tag.type === "behavior" && tag.value === tagName;
				});

				return matchingTags.length > 0;
			});
		}

		return matchingChildren;
	};

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };

    util.escapeHtml = function(value) {
        if(typeof value === "string") {
            return value.replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        } else {
            return value;
        }

    };

    util.stripHtml = function(value) {
        return typeof value === "string" ? value.replace(/[&<>"'\/]/g, "") : value;
    };

    util.generateUUID = function() {

        var d = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d/16);
            return (c === "x" ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };


    util.setMasterPreference = function(name, value) {

        var page = b$.portal.portalView.getElementsByTagName("page")[0];

        //save locally
        page.setPreference(name, value);
        page.model.save();

        //save to server on master page (if any)
        var req = lp.restClient.makePutPageRequest({
            contextPath: b$.portal.config.serverRoot,
            name: page.model.extendedItemName || page.model.name,
            contextItemName: page.model.contextItemName,
            properties: [{
                name: name,
                type: "string",
                value: value
            }]
        });
        return lp.restClient.sendRequest(req.url, req.method, req.body);
    };

    util.extractInitials = function(name) {

        var initials = '';
        name = name.split(' ');

        for (var i = 0; i < name.length; i++) {
            initials += name[i].substr(0,1);
        }

        initials = initials.toUpperCase();
        return initials;

    };

    util.getColorFromInitials = function(initials) {

        var a = initials.charCodeAt(0) - 64;
        var x = a + 120;

        var i  = Math.floor((((a - 1)/(26 - 1)) * (5 - 1) + 1) - 1);
        var colors = [
            [ x, 210, 210 ],
            [ x, x, 210 ],
            [ 210, x, x ],
            [ x, 210, x ],
            [ 210, x, 210 ]
        ];

        return colors[i];
    };


    util.defaultProfileImage = "/portalserver/static/launchpad/widgets/addressbook/media/address_placeholder.png";

    util.getDefaultProfileImage = function(name, width, height, color) {

        var canvas = document.createElement("canvas");

        if ( !canvas.getContext || !canvas.getContext('2d') ) {
            return util.defaultProfileImage;
        }

        var initials = util.extractInitials(name);
        color = color || util.getColorFromInitials(initials);

        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = $.isArray(color) ? "rgb(" + color.join(",") + ")" : color;
        ctx.fillRect (0, 0, width, height);

        ctx.fillStyle = "rgb(250,250,250)";

        var scale, marginRight;

        switch (initials.length) {
            case 1:
                scale = 0.6;
                marginRight = 4;
                break;

            case 2:
                scale = 0.5;
                marginRight = 3;
                break;

            case 3:
                scale = 0.45;
                marginRight = 2;
                break;

            default:
                scale = 0.3;
                marginRight = 0;
                break;
        }

        var fontSize = parseInt( scale * height, 10);
        var marginBottom = Math.floor( 0.15 * height);

        ctx.font = fontSize + "px Proxima Regular, Helvetica Nueue, Helvetica, Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(initials, width - 3, height - marginBottom);

        var dataUri = canvas.toDataURL("image/png");
        return dataUri;
    };

    /**
     * Get the selection position of an input field
     * @param {element} input the input field to get the caret position
     * @param {function} formatter function to handle formatting of input field
     */
    util.getSelectionPositionOfInput = function(input, formatter) {

        var textSelection = [];

        if(!formatter) {
            formatter = function(input) {
                return input;
            };
        }

        // get the selection start and end values
        if ('selectionStart' in input) {
            textSelection = [formatter(input.selectionStart), formatter(input.selectionEnd)];
        } else {
            // < IE9 version
            var range = document.selection.createRange();
            if (range && range.parentElement() === input) {
                var textInputRange = input.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());
                textSelection[0] = formatter(textInputRange.moveStart('character', -input.value.length));
                textSelection[1] = formatter(textInputRange.moveEnd('character', -input.value.length));
            }
        }

        return textSelection;
    };

    /**
     * Gets the caret position of an input field after it has been updated
     * @param {element} input the input field
     * @param {array} previousTextSelection the previous selection on the input before the update
     * @param {integer} lengthDiff the difference in length between the previous value and the new value
     * @param {boolean} isBackspace if the last keypress was a backspace
     */
    util.getNewCaretPosition = function(input, previousTextSelection, lengthDiff, isBackspace) {
        var cursorPosition = previousTextSelection[0];

        lengthDiff = previousTextSelection[1] - previousTextSelection[0] + lengthDiff;
        if (lengthDiff <= 0) {
            lengthDiff = 1;
        }
        // reset the selection values if input field is empty
        if (!input.value.length) {
            previousTextSelection = [0, 0];
        }

        if (previousTextSelection[0] === previousTextSelection[1]) {
            // if the nothing is selected in the input field
            if (isBackspace) {
                cursorPosition = previousTextSelection[0] === 0 ? 0 : previousTextSelection[0] - 1;
            } else {
                cursorPosition = previousTextSelection[0] + lengthDiff;
            }
        }
        else {
            // if something is selected
            if (isBackspace) {
                cursorPosition = previousTextSelection[0];
            } else {
                cursorPosition = previousTextSelection[0] + lengthDiff;
            }
        }

        return cursorPosition;
    };

    /**
     * Sets the caret position of input field an handles the scroll to have the caret centered
     * @param {element} input the input field to set the caret position of
     * @param {integer} cursorPosition numeric value representing the desired caret position
     * @param {string} content content of input field
     * @param {element} dummyField dummy field to measure length of text
     */
    util.setCaretPositionOfInput = function(input, cursorPosition, content, dummyField) {

        var scroll;

        // set the correct cursor position
        if ('setSelectionRange' in input) {
            input.setSelectionRange(cursorPosition, cursorPosition);
        } else {
            // < IE9 version
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', cursorPosition);
            range.moveStart('character', cursorPosition);
            range.select();
        }

        //handle input scroll
        if(content && dummyField) {
            if (content) {
                dummyField.text(content.substr(0, cursorPosition));
            } else {
                dummyField.text("");
            }

            scroll = dummyField.width() - $(input).width() / 2;
            input.scrollLeft = scroll;
        }
    };

    /**
     * Validate the payment detail checksum based on ISO 7064
     * http://en.wikipedia.org/wiki/International_Bank_Account_Number#Validating_the_IBAN
     * @param  {string} input the input to be validated
     */
    util.validateISO7064Checksum = function(input) {
        /**
         * Replace letters from the IBAN with numbers
         * @param  {string} str [description]
         */
        var replaceLetters = function(str) {
            var strArray = str.split('');
            for (var i = 0; i < strArray.length; i++) {
                if (/[A-Z]/.test(strArray[i])) {
                    strArray[i] = strArray[i].charCodeAt(0) - 55;
                }
            }
            return strArray.join('');
        };

        /**
         * Performs a basic mod-97 operation for IBAN validation (as described in ISO 7064)
         * @param  {string} str Max 9 character string respresenting part of the IBAN
         */
        var mod97 = function(str) {
            var result = parseInt(str, 10) % 97;
            result = result.toString();

            return result.length === 1 ? '0' + result : result;
        };

        if(input) {
            input = input.substr(4) + input.substr(0, 4);
            input = replaceLetters(input);

            //bypasses javascript INT32 restriction
            while (input.length > 2) {
                input = mod97(input.substr(0, 9)) + input.substr(9);
            }

            if (parseInt(input, 10) === 1) {
                return true;
            }
        }

        return false;
    };

    /**
     * Export
     */
    window.lp = window.lp || {};
    window.lp.util = util;

})(window, jQuery);
