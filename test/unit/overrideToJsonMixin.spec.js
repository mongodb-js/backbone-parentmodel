'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

const chai = require('chai');
const expect = chai.expect;

const subject = require('../../src/overrideToJsonMixin');

describe('overrideToJsonMixin', function() {

    context('when mixed into a Backbone.Model with no child descriptors', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend();
            _.extend(Model.prototype, subject);

            this.model = new Model({
                a: 1,
                b: 2
            });
        });

        it('should return equivalent to Backbone.Model.toJSON', function() {
            const standardToJson = Backbone.Model.prototype.toJSON.call(this.model);
            const nestedToJson = this.model.toJSON();
            expect(nestedToJson).to.eql(standardToJson);
        });
    });

    context('when mixed into a Backbone.Model with two levels of childModels/childCollections', function() {
        beforeEach(function() {
            const Parent = Backbone.Model.extend({
                childModels: function() {
                    return {
                        child: Parent
                    };
                },

                childCollections: function() {
                    return {
                        friends: Backbone.Collection
                    };
                }
            });
            _.extend(Parent.prototype, subject);

            this.model = new Parent({
                name: 'Alice',
                child: new Parent({
                    name: 'Bob',
                    child: new Parent({
                        name: 'Charlie'
                    }),
                    friends: new Backbone.Collection([{
                        name: 'Bill'
                    }, {
                        name: 'Becky'
                    }])
                }),
                friends: new Backbone.Collection([{
                    name: 'Al'
                }, {
                    name: 'Andy'
                }])
            });
        });

        describe('toJSON method', function() {

            it('results should contain nested toJSON methods', function() {
                expect(this.model.toJSON()).to.eql({
                    name: 'Alice',
                    child: {
                        name: 'Bob',
                        child: {
                            name: 'Charlie'
                        },
                        friends: [{
                            name: 'Bill'
                        }, {
                            name: 'Becky'
                        }]
                    }, friends: [{
                        name: 'Al'
                    }, {
                        name: 'Andy'
                    }]
                });
            });
        });
    });
});
