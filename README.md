# backbone-parentmodel

[![Build Status](https://travis-ci.org/mongodb-js/backbone-parentmodel.svg?branch=master)](https://travis-ci.org/mongodbjs/backbone-parentmodel)

backbone-parentmodel provides a set of extensions to Backbone.Model for working with nested structures where logic is assigned to nested Models and Collections. The core functionality is to override `clone`, `toJSON`, and `parse` methods to handle the nesting. Nested structures are defined as:

```js
const MyModel = ParentModel.extend({
    childModels: {
        myModel: MyModelConstructor
    },
    childCollections: {
        myCollection: MyCollectionConstructor
    }
})
```

childModels and childCollections must either be an object mapping property names to their constructors, or they may be functions returning an object mapping.


## Getting Started

This package is published to [npm](https://www.npmjs.com/) and can be installed with
```
npm install backbone-parentmodel

```

## Documentation

See [our docs folder](./docs/README.md) for more detailed documentation.


## Contributing

We encourage you to contribute to this project!

Please read [our contributing guide](./CONTRIBUTING.md) for guidelines on:
- how to ask further questions
- how to report issues
- how to request or implement new features


## Maintainers

Please contact one of the project maintainers with any project issues or questions.

- Dennis Kuczynski [@denniskuczynski](https://github.com/denniskuczynski)


## LICENSE

[Apache 2](./LICENSE)
