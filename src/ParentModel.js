'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

const childCreationMixin = require('./childCreationMixin');
const childAccessorMixin = require('./childAccessorMixin');
const getAttributesMixin = require('./getAttributesMixin');
const overrideParseMixin = require('./overrideParseMixin');
const overrideToJsonMixin = require('./overrideToJsonMixin');
const overrideClearMixin = require('./overrideClearMixin');
const overrideCloneMixin = require('./overrideCloneMixin');

const ParentModel = Backbone.Model.extend({});
_.extend(
    ParentModel.prototype,
    childCreationMixin,
    childAccessorMixin,
    getAttributesMixin,
    overrideParseMixin,
    overrideToJsonMixin,
    overrideClearMixin,
    overrideCloneMixin
);

module.exports = ParentModel;
