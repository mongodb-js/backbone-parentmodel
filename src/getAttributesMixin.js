// getAttributesMixin
// ------------------

// Return the full set of attributes converting child models/collections to objects
//
// NOTE: toJSON should be used when formatting data to be sent to the server.
// getAttributes is intended for serializing attributes to pure objects, i.e.,
// for use in a template function

'use strict';

const _ = require('underscore');

module.exports = {

    getAttributes: function(options) {
        function getModelAttributes(model) {
            if (typeof model.getAttributes === 'function') {
                return model.getAttributes(options);
            } else {
                return _.extend({}, model.attributes);
            }
        }

        const attrs = _.extend({}, this.attributes);

        const childModels = _.result(this, 'childModels');
        if (typeof childModels === 'object') {
            Object.keys(childModels).forEach(key => {
                if (attrs[key]) {
                    attrs[key] = getModelAttributes(attrs[key]);
                }
            });
        }

        const childCollections = _.result(this, 'childCollections');
        if (typeof childCollections === 'object') {
            Object.keys(childCollections).forEach(key => {
                if (attrs[key]) {
                    attrs[key] = attrs[key].map(getModelAttributes);
                }
            });
        }

        return attrs;
    }
};
