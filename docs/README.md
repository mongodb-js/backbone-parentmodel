# backbone-parentmodel Documentation

## Including backbone-parentmodel functionality

Typically a user should use the provided backbone-parentmodel class for new models.

```js
const ParentModel = require('backbone-parentmodel');

const MyParentModel = ParentModel.extend({
    ...
});
```

Alternatively, you may manually extend a model with the individually provided mixins.

```js
const _ = require('underscore');
const Backbone = require('backbone');

const MyMixinModel = Backbone.Model.extend({
    ...
});

_.extend(
    MyMixinModel.prototype,
    require('backbone-parentmodel/lib/childCreationMixin'),
    require('backbone-parentmodel/lib/childAccessorMixin'),
    require('backbone-parentmodel/lib/getAttributesMixin'),
    require('backbone-parentmodel/lib/overrideParseMixin'),
    require('backbone-parentmodel/lib/overrideToJsonMixin'),
    require('backbone-parentmodel/lib/overrideClearMixin'),
    require('backbone-parentmodel/lib/overrideCloneMixin')
);
```


## Defining child models and collections

Child models and collections are defined on a model through the `childModels` and `childCollections` attributes.
These attributes must either point to an object defining the constructors for the children or functions returning such objects.

```js
// Using Object notation
const MyParentModel = ParentModel.extend({
    childModels: {
        myModel: MyModel
    },
    childCollections: {
        myCollection: MyCollection
    }
});

// Using function notation
const MyParentModel = ParentModel.extend({
    childModels: function() {
        return {
            myModel: MyModel
        };
    },
    childCollections: function() {
        return {
            myCollection: MyCollection
        };
    },
});
```


## Features

### [backbone-parentmodel/lib/overrideParseMixin](../blob/master/src/overrideParseMixin.js)

This mixin overrides Backbone.Model's implementation of `parse` such that objects and arrays representing the defined `childModels` and `childCollections` are converted to their Model/Collection instances.  When parse is called on a model with existing fields, references are maintained such that existing model and collection objects are reused.

If the `{ patch: true }` option is present, attributes missing in the input JSON are ignored. Otherwise missing attributes will be cleared.


### [backbone-parentmodel/lib/overrideToJsonMixin](../blob/master/src/overrideToJsonMixin.js)

This mixin overrides Backbone.Model's implementation of `toJSON` such that `childModels` and `childCollections` are also converted using their `toJSON` methods.


### [backbone-parentmodel/lib/overrideCloneMixin](../blob/master/src/overrideCloneMixin.js)

This mixin overrides Backbone.Model's implementation of `clone` such that `childModels` and `childCollections` are also cloned.


### [backbone-parentmodel/lib/overrideClearMixin](../blob/master/src/overrideClearMixin.js)

This mixin overrides Backbone.Model's implementation of `clear` to provide two new options:
* preserveChildReferences - instead of unsetting nested attributes, maintains the object references while clearing/reseting each nested structure
* restoreDefaults - additionally restores any `defaults` on the model after clearing all attributes


### [backbone-parentmodel/lib/childCreationMixin](../blob/master/src/childCreationMixin.js)

This mixin exposes two utility methods:
* createChildModel - used to instantiate an instance of a childModel
* createChildCollection - used to instantiate an instance of a childCollection


### [backbone-parentmodel/lib/childAccessorMixin](../blob/master/src/childAccessorMixin.js)

This mixin exposes two utility methods:
* getChild - method to `get` nested attributes using dot notation, i.e. `myModel.get('address.street')`
* setChild - method to `set` nested attributes using dot notation, i.e. `myModel.set('address.street', 'Baker Street')`


### [backbone-parentmodel/lib/getAttributesMixin](../blob/master/src/getAttributesMixin.js)

This mixin exposes a new method: `getAttributes` that returns the Model's attributes where each nested Model and Collection are converted to objects and arrays respectivley.

This method is useful in cases where you would pass `model.attributes` to a template function expecting pure javascript objects.

