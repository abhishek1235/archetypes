define("launchpad/lib/contacts/contacts-model", [
    'jquery',
    'angular',
    'launchpad/lib/common/util',
    'launchpad/lib/contacts/contacts-module'
], function($, angular, util, contactsModule) {

    'use strict';

    contactsModule.factory('ContactsModel', ['$rootScope', 'orderByFilter', 'httpService', function($rootScope, orderByFilter, httpService) {

        /**
         * Contacts service constructor
         * @param config
         * @constructor
         */
        var ContactsModel = function(config) {

            var self = this;

            self.locale = config.locale;
            self.contactsListService = httpService.getInstance({
                endpoint: config.contacts
            });
            if (config.contactData) {
                self.contactDataServiceEndpoint = config.contactData;
            }
            if (config.contactDetails) {
                self.contactDetailsServiceEndpoint = config.contactDetails;
                self.contactDetailsData = [];
            }
            if (config.metaData) {
                self.metaDataEndpoint = config.metaData;
            }
            self.contacts = [];

            if (config.lazyload !== true) {
                self.loadContacts();
            }
        };

        /**
         * Load contacts
         */
        ContactsModel.prototype.loadContacts = function() {

            var self = this;
            var xhr = self.contactsListService.read();
            self.loading = true;

            xhr.success(function(data) {
                if (data && data !== 'null') {
                    self.contacts = self.preprocessContacts(data);
                } else {
                    self.contacts = [];
                }

            });
            xhr.error(function(data) {
                self.error = {
                    message: data.statusText
                };
            });
            xhr['finally'](function() {
                self.loading = false;
            });

            return xhr;
        };

        /**
         * Load details
         * @returns {*}
         */
        ContactsModel.prototype.loadContactDetails = function(contactUUID) {

            var self = this;

            // check if contact details exist on clientside
            if (self.contactDetailsData.length > 0) {
                angular.forEach(self.contactDetailsData, function(contact) {
                    if (contact && contact.id === contactUUID) {
                        self.currentDetails = contact;

                        // set loaded from client side
                        self.detailsLoaded = true;
                        return;
                    }
                });
            }

            // Check if details are already loaded from clientside
            if (self.detailsLoaded) {

                self.detailsLoaded = false;

            // else get details from serverside
            } else {

                this.contactDetailsService = httpService.getInstance({
                    endpoint: this.contactDetailsServiceEndpoint,
                    urlVars: {
                        contactId: contactUUID
                    }
                });

                var xhr = self.contactDetailsService.read();

                self.loading = true;

                var detailsCallback = function() {
                    self.contactDetailsData.push(self.currentDetails);
                };

                xhr.success(function(data) {
                    self.currentDetails = data;
                    detailsCallback();
                });
                xhr.error(function(data) {
                    self.error = {
                        message: data.statusText
                    };
                });
                xhr['finally'](function() {
                    self.loading = false;
                });

                return xhr;
            }
        };

        /**
         * Modify contact data and sort
         * @param contacts
         * @returns {*}
         */
        ContactsModel.prototype.preprocessContacts = function(contacts) {

            //var self = this;
            var newContacts = [];

            // TODO: add ticket for serverside to return alphabetical contacts
            newContacts = orderByFilter(contacts, 'name');
            return newContacts;

        };

        /**
         * Create contact
         * @param valid
         * @returns {*}
         */
        ContactsModel.prototype.createContact = function(valid) {

            if (!valid) {
                return false;
            }

            var self = this;
            var contactId = self.currentContact.id;
            self.currentContact.photoUrl = util.getDefaultProfileImage(self.currentContact.name, 77, 77);

            self.contactDataService = httpService.getInstance({
                endpoint: this.contactDataServiceEndpoint,
                urlVars: {
                    contactId: contactId
                }
            });

            self.contactDetailsService = httpService.getInstance({
                endpoint: this.contactDetailsServiceEndpoint,
                urlVars: {
                    contactId: contactId
                }
            });

            var xhrContactUpdate = self.contactDataService.create({
                data: self.currentContact
            });

            var xhrDetailsUpdate = self.contactDetailsService.create({
                data: self.currentDetails
            });

            var detailsCallback = function() {
                self.contacts.push(self.currentContact);
                self.contactDetailsData.push(self.currentDetails);
                self.refreshModel();
            };

            self.sendXhrRequest(xhrContactUpdate);
            return self.sendXhrRequest(xhrDetailsUpdate, detailsCallback);

        };


        /**
         * Update contact
         * @param valid
         * @returns {*}
         */
        ContactsModel.prototype.updateContact = function(valid) {

            if (!valid) {
                return false;
            }

            var self = this;
            var currentId = self.currentContact.id;

            // remove extra contact fields before sending request
            var cleanData = function(allowedFields, obj) {

                var result = {};

                angular.forEach(obj, function(value, key){
                    allowedFields.forEach( function(fieldName) {
                        if (fieldName === key) {
                            result[key] = value;
                        }
                    });
                });

                return result;
            };

            var addEmptyFields = function(allowedFields, obj) {

                allowedFields.forEach(function(key) {
                    if(!obj[key]) {
                        obj[key] = null;
                    }
                });

                return obj;

            };

            // TODO: check if name || account is $dirty

            // update contact data

                self.contactDataService = httpService.getInstance({
                    endpoint: self.contactDataServiceEndpoint,
                    urlVars: {
                        contactId: currentId
                    }
                });

                if (self.currentContact.photoUrl === undefined ) {
                    self.currentContact.photoUrl = util.getDefaultProfileImage(self.currentContact.name, 77, 77);
                }

                var contactFields = ["name","id","photoUrl","partyId","account"];
                var cleanContactData = cleanData(contactFields, self.currentContact);
                var xhrContactUpdate = self.contactDataService.update({
                    data: cleanContactData
                });

                var contactCallback = function() {
                    self.contacts[self.index] = self.currentContact;
                    self.refreshModel();
                };

                self.sendXhrRequest(xhrContactUpdate, contactCallback);

                // TODO: check if detail fields are $dirty

                self.contactDetailsService = httpService.getInstance({
                    endpoint: self.contactDetailsServiceEndpoint,
                    urlVars: {
                        contactId: currentId
                    }
                });

                var detailFields = ["address","city","state","dateOfBirth","email","phone","id"];
                var cleanDetailsData = cleanData(detailFields, self.currentDetails);
                var fullDetailsData = addEmptyFields(detailFields, cleanDetailsData);
                var xhrDetailsUpdate = self.contactDetailsService.update({
                    data: fullDetailsData
                });

                var detailsCallback = function() {

                    // replace clientside contact data with new data
                    if (self.contactDetailsData.length > 0) {
                        angular.forEach(self.contactDetailsData, function(contact) {
                            if (contact && contact.id === currentId) {
                                contact = cleanDetailsData;
                                self.currentDetails = contact;
                                return;
                            }
                        });
                    }
                };

                return self.sendXhrRequest(xhrDetailsUpdate, detailsCallback);
        };


        /**
         * Delete contact
         * @returns {*}
         */
        ContactsModel.prototype.deleteContact = function() {

            var self = this;
            var cid = self.currentContact.id;

            self.contactDataService = httpService.getInstance({
                endpoint: self.contactDataServiceEndpoint,
                urlVars: {
                    contactId: cid
                }
            });

            var xhrDeleteContact = self.contactDataService.del({
                data: null
            });

            var successCallback = function(cid) {

                // remove contact from client side data
                angular.forEach(self.contacts, function(contact) {
                    if(contact.id === cid) {
                        var index = self.contacts.indexOf(contact);
                        self.contacts.splice(index, 1);
                    }
                });

                if (self.contacts.length > 0) {
                    self.currentContact = self.contacts[0];
                } else {
                    self.currentContact = null;
                    self.moduleState = 'contactsNone';
                }
                self.refreshModel();

            };

            self.sendXhrRequest(xhrDeleteContact, successCallback(cid));

        };


        /**
         * Displays if no contacts found
         * @returns {*}
         */
        ContactsModel.prototype.noContactsFound = function() {
            var noContactsFound = !this.loading && this.contacts.length === 0;
            return noContactsFound;
        };


        /**
         * Send xhr request
         * @param xhr
         * @returns {*}
         */
        ContactsModel.prototype.sendXhrRequest = function(xhr, callback) {

            var self = this;

            xhr.loading = true;
            xhr.success(function(data) {

                if (callback) {
                    callback();
                }
            });
            xhr.error(function(data) {
                self.error = {
                    message: data.statusText
                };
            });
            xhr['finally'](function() {
                xhr.loading = false;
            });
            return xhr;
        };


        // move to controller
        /**
         * Select Contact
         * @param contact
         */
        ContactsModel.prototype.selectContact = function(contact) {

            var self = this;

            if (contact && !self.disableSelection) {
                if (self.contacts.length > 0) {
                    self.selected = contact.id;
                    self.currentContact = contact;
                    self.idx = self.contacts.indexOf(self.currentContact);
                    self.loadContactDetails(self.currentContact.id);
                } else {
                    self.currentContact = null;
                    self.moduleState = 'contactsNone';
                }
            }

        };

        /**
         * Refresh Model
         * @param method
         */
        ContactsModel.prototype.refreshModel = function(method) {

            var self = this;
            self.disableSelection = false;

            if (self.currentContact) {
                self.selectContact(self.currentContact);
                self.moduleState = 'contactsView';
            }

        };

        /**
         * Find a contact by name.
         * @param method
         */
        ContactsModel.prototype.findByName = function(name) {

            for (var i = 0, n = this.contacts.length; i < n; i++) {
                var contact = this.contacts[i];
                if (contact.name === name) {
                    return contact;
                }
            }

        };


        return ContactsModel;
    }]);
});
