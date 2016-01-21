// childCreationMixin
// ------------------

// Helper methods to instantiate instances of child models / collections

'use strict';

const _ = require('underscore');

module.exports = {

    createChildModel: function(modelName, attributes, options) {
        const childModels = _.result(this, 'childModels');
        if (!childModels) {
            throw new Error('childModels property not found');
        }

        const ModelConstructor = childModels[modelName];
        if (!ModelConstructor) {
            throw new Error('No constructor found for ' + modelName);
        }

        return new ModelConstructor(attributes, options);
    },

    createChildCollection: function(collectionName, models, options) {
        const childCollections = _.result(this, 'childCollections');
        if (!childCollections) {
            throw new Error('childCollections property not found');
        }

        const CollectionConstructor = childCollections[collectionName];
        if (!CollectionConstructor) {
            throw new Error('No constructor found for ' + collectionName);
        }

        return new CollectionConstructor(models, options);
    }
};
