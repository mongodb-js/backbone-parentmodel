'use strict';

const Backbone = require('backbone');
const _ = require('underscore');

const chai = require('chai');
const expect = chai.expect;

const subject = require('../../src/childAccessorMixin');

describe('childAccessorMixin', function() {

    context('when mixed into a Backbone.Model with no child descriptors', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend();
            _.extend(Model.prototype, subject);

            this.model = new Model();
        });

        it('should fail when trying to set nested attribute', function() {
            expect(() => {
                this.model.setChild('address.street', 'myStreet');
            }).to.throw(/childModels property not found/);
        });
    });

    context('when mixed into a Backbone.Model with two levels of childModels', function() {
        beforeEach(function() {
            const Parent = Backbone.Model.extend({
                childModels: function() {
                    return {
                        child: Parent,
                        bestFriend: Parent
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
                    })
                }),
                backboneModel: new Backbone.Model({
                    x: 1
                })
            });
        });

        describe('getChild method', function() {

            it('should return non-nested attribute', function() {
                expect(this.model.getChild('name')).to.equal('Alice');
            });

            it('should return one level nested attribute', function() {
                expect(this.model.getChild('child.name')).to.equal('Bob');
            });

            it('should return two level nested attribute', function() {
                expect(this.model.getChild('child.child.name')).to.equal('Charlie');
            });

            it('should return undefined when child model does not exist', function() {
                expect(this.model.getChild('address.street')).to.equal(undefined);
            });
        });

        describe('setChild method', function() {

            it('should be able to set non-nested attribute', function() {
                this.model.setChild('nickname', 'Junior');
                expect(this.model.getChild('nickname')).to.equal('Junior');
            });

            it('should be able to set one level nested attribute', function() {
                this.model.setChild('child.name', 'Henry');
                expect(this.model.getChild('child.name')).to.equal('Henry');
            });

            it('should be able to set two level nested attribute', function() {
                this.model.setChild('child.child.name', 'Henry');
                expect(this.model.getChild('child.child.name')).to.equal('Henry');
            });

            it('should be able to init undefined one level nested child', function() {
                this.model.setChild('bestFriend.name', 'Sue');
                expect(this.model.getChild('bestFriend.name')).to.equal('Sue');
            });

            it('should be able to init undefined two level nested child', function() {
                this.model.setChild('bestFriend.child.name', 'Jane');
                expect(this.model.getChild('bestFriend.child.name')).to.equal('Jane');
            });

            it('should fail when trying to set for child model that was not defined', function() {
                expect(() => {
                    this.model.setChild('address.street', 'myStreet');
                }).to.throw(/No constructor found for address/);
            });

            it('should be able to set into regular backbone model', function() {
                this.model.setChild('backboneModel.x', 2);
                expect(this.model.getChild('backboneModel.x')).to.equal(2);
            });
        });
    });
});
