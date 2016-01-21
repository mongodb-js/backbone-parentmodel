'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

const chai = require('chai');
const expect = chai.expect;

const subject = require('../../src/overrideClearMixin');

describe('overrideClearMixin', function() {

    context('when mixed into a Backbone.Model with no child descriptors', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend();
            _.extend(Model.prototype, subject);

            this.model = new Model({
                a: 1,
                b: 2
            });
        });

        it('should return equivalent to Backbone.Model.clear with no options', function() {
            const standardClear = Backbone.Model.prototype.clear.call(this.model);
            const nestedClear = this.model.clear();
            expect(nestedClear).to.eql(standardClear);
        });

        it('should return equivalent to Backbone.Model.clear with preserveChildReferences option', function() {
            const standardClear = Backbone.Model.prototype.clear.call(this.model, { preserveChildReferences: true });
            const nestedClear = this.model.clear({ preserveChildReferences: true });
            expect(nestedClear).to.eql(standardClear);
        });
    });

    context('when mixed into a Backbone.Model with two levels of childModels/childCollections', function() {
        beforeEach(function() {
            const Parent = Backbone.Model.extend({
                defaults: {
                    favoriteColor: 'blue'
                },

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

        describe('clear method', function() {

            it('should have cleared standard attributes', function() {
                this.model.clear({ preserveChildReferences: true });
                expect(this.model.get('name')).to.not.exist;
            });

            it('should have same cid at for child models', function() {
                const childCid = this.model.get('child').cid;
                this.model.clear({ preserveChildReferences: true });
                expect(this.model.get('child').cid).to.equal(childCid);
            });

            it('should have 0 length child collection models', function() {
                this.model.clear({ preserveChildReferences: true });
                expect(this.model.get('friends').length).to.equal(0);
            });

            it('should have same reference for child collection models', function() {
                const friendsRef = this.model.get('friends');
                this.model.clear({ preserveChildReferences: true });
                expect(this.model.get('friends')).to.equal(friendsRef);
            });

            it('should be able to restore defaults for top-level', function() {
                this.model.clear({ restoreDefaults: true });
                expect(this.model.get('favoriteColor')).to.eq('blue');
                expect(this.model.get('child')).to.not.exist;
            });

            it('should be able to restore defaults for children', function() {
                this.model.clear({ preserveChildReferences: true, restoreDefaults: true });
                expect(this.model.get('favoriteColor')).to.eq('blue');
                expect(this.model.get('child').get('favoriteColor')).to.eq('blue');
            });
        });
    });
});
