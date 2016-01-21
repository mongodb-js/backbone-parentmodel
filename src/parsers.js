// parsers
// ------------------

// Utility methods for parsing nested structures
// These should only be used if overriding default child parsing logic, e.g. children must be parsed in specific order

'use strict';

const _ = require('underscore');

function parseChildModel(parent, resp, options, ChildModelConstructor, key) {
    const existingModel = parent.get(key);
    options = options || {};
    if (resp[key]) {
        // If presented with a new value, update the existing model or create a new one
        const opts = _.extend({}, options, { parse: true });
        if (existingModel) {
            existingModel.set(existingModel.parse(resp[key], opts));
            resp[key] = existingModel;
        } else {
            resp[key] = new ChildModelConstructor(resp[key], opts);
        }
    } else if (!options.patch) {
        // Otherwise unset the existing unless a PATCH call
        parent.unset(key);
    }

}

function parseChildCollection(parent, resp, options, ChildCollectionConstructor, key) {
    const existingCollection = parent.get(key);
    options = options || {};
    if (resp[key]) {
        // If presented with a new value, update the existing collection or create a new one
        const opts = _.extend({}, options, { parse: true });
        if (existingCollection) {
            existingCollection.set(resp[key], opts);
            resp[key] = existingCollection;
        } else {
            resp[key] = new ChildCollectionConstructor(resp[key], opts);
        }
    } else {
        // Otherwise reset the existing collection unless a PATCH call
        if (existingCollection && !options.patch) {
            existingCollection.reset([], options);
        }
    }
}

module.exports = {
    parseChildModel: parseChildModel,
    parseChildCollection: parseChildCollection
};
