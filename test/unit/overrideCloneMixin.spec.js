'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

const chai = require('chai');
const expect = chai.expect;

const subject = require('../../src/overrideCloneMixin');

describe('overrideCloneMixin', function() {

    context('when mixed into a Backbone.Model with no child descriptors', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend();
            _.extend(Model.prototype, subject);

            this.model = new Model({
                a: 1,
                b: 2
            });
        });

        it('should return equivalent to Backbone.Model.clone', function() {
            const standardClone = _.omit(Backbone.Model.prototype.clone.call(this.model), 'cid');
            const nestedClone = _.omit(this.model.clone(), 'cid');
            expect(nestedClone).to.eql(standardClone);
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

        describe('clone method', function() {

            it('should have different cid at top-level', function() {
                const clone = this.model.clone();
                expect(clone.cid).to.not.equal(this.model.cid);
            });

            it('should have different cid at for child models', function() {
                const clone = this.model.clone();
                expect(clone.get('child').cid).to.not.equal(this.model.get('child').cid);
            });

            it('should have different reference for child collections', function() {
                const clone = this.model.clone();
                expect(clone.get('friends')).to.not.equal(this.model.get('friends'));
            });

            it('should have different cids for child collection models', function() {
                const clone = this.model.clone();
                expect(clone.get('friends').at(0).cid).to.not.equal(this.model.get('friends').at(0).cid);
            });
        });
    });
});
