// overrideClearMixin
// ------------------

// Override Backbone.Model.clear implementation to optionally:
// - preserve child references
// - restore default values

'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

module.exports = {

    clear: function(options) {
        options = options || {};

        if (options.preserveChildReferences) {
            const childModels = _.result(this, 'childModels') || {};
            const childCollections = _.result(this, 'childCollections') || {};
            const attrsToUnset = {};
            for (let key in this.attributes) {
                if (key in childModels) {
                    this.attributes[key].clear(options);
                } else if (key in childCollections) {
                    this.attributes[key].reset([], options);
                } else {
                    attrsToUnset[key] = void 0;
                }
            }

            this.set(attrsToUnset, _.extend({}, options, { unset: true }));
        } else {
            Backbone.Model.prototype.clear.call(this, options);
        }

        if (options.restoreDefaults) {
            const defaults = _.defaults({}, this.attributes, _.result(this, 'defaults'));
            this.set(defaults, options);
        }

        return this;
    }
};
