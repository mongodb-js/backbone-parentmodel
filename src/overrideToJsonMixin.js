// overrideToJsonMixin
// ------------------

// Override Backbone.Model.toJSON implementation to handle child models / collections

'use strict';

const _ = require('underscore');

module.exports = {

    toJSON: function(options) {
        const attrs = _.clone(this.attributes);

        const childModels = _.result(this, 'childModels');
        if (typeof childModels === 'object') {
            Object.keys(childModels).forEach(key => {
                if (attrs[key]) {
                    attrs[key] = attrs[key].toJSON(options);
                }
            });
        }

        const childCollections = _.result(this, 'childCollections');
        if (typeof childCollections === 'object') {
            Object.keys(childCollections).forEach(key => {
                if (attrs[key]) {
                    attrs[key] = attrs[key].toJSON(options);
                }
            });
        }

        return attrs;
    }
};
