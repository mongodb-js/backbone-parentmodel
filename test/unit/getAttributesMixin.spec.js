'use strict';

const Backbone = require('backbone');
const _ = require('underscore');

const chai = require('chai');
const expect = chai.expect;

const subject = require('../../src/getAttributesMixin');

describe('getAttributesMixin', function() {

    context('when mixed into a Backbone.Model with no child descriptors', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend();
            _.extend(Model.prototype, subject);

            this.model = new Model({
                a: 1,
                b: 2
            });
        });

        it('should return flat attributes', function() {
            expect(this.model.getAttributes()).to.eql({
                a: 1,
                b: 2
            });
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

        describe('getAttributes method', function() {

            it('should return nested attributes', function() {
                expect(this.model.getAttributes()).to.eql({
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

            it('should not modify original attributes', function() {
                expect(this.model.attributes).to.not.eql({
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
