'use strict';

const Backbone = require('backbone');
const _ = require('underscore');

const chai = require('chai');
const expect = chai.expect;

const subject = require('../../src/childCreationMixin');

describe('childCreationMixin', function() {

    context('when mixed into a Backbone.Model with no child descriptors', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend();
            _.extend(Model.prototype, subject);

            this.model = new Model();
        });

        it('should fail when trying to create child model', function() {
            expect(() => {
                this.model.createChildModel('chldMdl', {}, {
                    testOpt: 'opt'
                });
            }).to.throw(/childModels property not found/);
        });

        it('should fail when trying to create child collection', function() {
            expect(() => {
                this.model.createChildCollection('chldCol', [], {
                    testOpt: 'opt'
                });
            }).to.throw(/childCollections property not found/);
        });
    });

    context('when mixed into a Backbone.Model with childModels', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend({
                childModels: {
                    model: Backbone.Model
                },
                childCollections: {
                    collection: Backbone.Collection
                }
            });
            _.extend(Model.prototype, subject);

            this.model = new Model();
        });

        it('can create instance of child model', function() {
            const instance = this.model.createChildModel('model', {
                name: 'Alice'
            });
            expect(instance).to.exist;
            expect(instance.get('name')).to.equal('Alice');
        });

        it('can create instance of child collection', function() {
            const instance = this.model.createChildCollection('collection', [
                { name: 'Alice' }
            ]);
            expect(instance).to.exist;
            expect(instance.length).to.equal(1);
            expect(instance.at(0).get('name')).to.equal('Alice');
        });

        it('will fail if unknown model', function() {
            expect(() => {
                this.model.createChildModel('unknown', {});
            }).throw(/No constructor found for unknown/);
        });

        it('will fail if unknown collection', function() {
            expect(() => {
                this.model.createChildCollection('unknown', {});
            }).throw(/No constructor found for unknown/);
        });
    });
});
