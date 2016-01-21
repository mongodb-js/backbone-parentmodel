// childAccessorMixin
// ------------------

// Helper methods to get and set into child models with
// dot seperated lists of keys, e.g. 'person.address.street'

'use strict';

const _ = require('underscore');

module.exports = {

    getChild: function(keypath) {
        const keys = keypath.split('.');
        let key = keys[0];
        let self = this;
        for (let i = 1; i < keys.length; i++) {
            self = self.attributes[key];
            key = keys[i];
            if (!self) {
                return undefined;
            }
        }

        return self.attributes[key];
    },

    setChild: function(keypath, value, options) {
        const keys = keypath.split('.');
        const key = keys[0];
        if (keys.length === 1) {
            this.set(key, value, options);
        } else {
            const remainingKeyPath = _.rest(keys).join('.');
            let child = this.get(key);
            if (!child) {
                // Create child model if necessary
                const childModels = _.result(this, 'childModels');
                if (!childModels) {
                    throw new Error('childModels property not found');
                }

                const ChildModelConstructor = childModels[key];
                if (!ChildModelConstructor) {
                    throw new Error('No constructor found for ' + key);
                }

                child = new ChildModelConstructor();
                this.set(key, child);
            }

            // Set the value for the child
            if (typeof child.setChild === 'function') {
                child.setChild(remainingKeyPath, value, options);
            } else {
                child.set(remainingKeyPath, value, options);
            }
        }

        return this;
    }
};
