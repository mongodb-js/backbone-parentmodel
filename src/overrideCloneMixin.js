// overrideCloneMixin
// ------------------

// Override Backbone.Model.clone implementation to handle child models / collections

'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

function deepCollectionClone(collection) {
    return new collection.constructor(
        collection.map(model => model.clone()), {
            model: collection.model,
            comparator: collection.comparator
        }
    );
}

module.exports = {

    clone: function() {
        const clonedParent = Backbone.Model.prototype.clone.call(this);

        const childModels = _.result(this, 'childModels');
        if (typeof childModels === 'object') {
            Object.keys(childModels).forEach(key => {
                var childModel = clonedParent.get(key);
                if (childModel) {
                    clonedParent.set(key, childModel.clone());
                }
            });
        }

        const childCollections = _.result(this, 'childCollections');
        if (typeof childCollections === 'object') {
            Object.keys(childCollections).forEach(key => {
                var childCollection = clonedParent.get(key);
                if (childCollection) {
                    clonedParent.set(key, deepCollectionClone(childCollection));
                }
            });
        }

        return clonedParent;
    }
};
