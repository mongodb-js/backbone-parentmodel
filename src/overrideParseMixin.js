// overrideParseMixin
// ------------------

// Override Backbone.Model.parse implementation to handle child models / collections

'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

const parsers = require('./parsers');

module.exports = {

    parse: function(resp, options) {
        const parsed = Backbone.Model.prototype.parse.call(this, resp, options);

        const childModels = _.result(this, 'childModels');
        if (typeof childModels === 'object') {
            Object.keys(childModels).forEach(key => {
                parsers.parseChildModel(this, resp, options, childModels[key], key);
            });
        }

        const childCollections = _.result(this, 'childCollections');
        if (typeof childCollections === 'object') {
            Object.keys(childCollections).forEach(key => {
                parsers.parseChildCollection(this, resp, options, childCollections[key], key);
            });
        }

        return parsed;
    }
};
