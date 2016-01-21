'use strict';

const _ = require('underscore');
const Backbone = require('backbone');

const chai = require('chai');
const expect = chai.expect;

const subject = require('../../src/overrideParseMixin');

describe('overrideParseMixin', function() {

    context('when mixed into a Backbone.Model with no child descriptors', function() {
        beforeEach(function() {
            const Model = Backbone.Model.extend();
            _.extend(Model.prototype, subject);

            this.model = new Model({
                a: 1,
                b: 2
            });
        });

        it('should return equivalent to Backbone.Model.parse', function() {
            const standardParse = Backbone.Model.prototype.parse.call(this.model);
            const nestedParse = this.model.parse();
            expect(nestedParse).to.eql(standardParse);
        });
    });

    context('when mixed into a Backbone.Model with two levels of childModels/childCollections', function() {
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

        describe('parse method', function() {

            it('results should perform nested parsing', function() {
                const model = new Parent();
                const parsed = model.parse({
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
                    },
                    friends: [{
                        name: 'Al'
                    }, {
                        name: 'Andy'
                    }]
                });

                expect(parsed.child instanceof Parent).to.equal(true);
                expect(parsed.friends instanceof Backbone.Collection).to.equal(true);
                expect(parsed.friends.at(0) instanceof Backbone.Model).to.equal(true);
            });
        });

        context('when nested objects already exist', function() {

            beforeEach(function() {
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

            it('references for children and collections should not change', function() {
                const before = this.model;
                const after = this.model.parse({
                    name: 'Alice-x',
                    child: {
                        name: 'Bob-x',
                        child: {
                            name: 'Charlie-x'
                        },
                        friends: [{
                            name: 'Bill-x'
                        }, {
                            name: 'Becky-x'
                        }]
                    },
                    friends: [{
                        name: 'Al-x'
                    }, {
                        name: 'Andy-x'
                    }]
                });

                expect(after.name).to.equal('Alice-x');
                expect(after.child).to.equal(before.get('child'));
                expect(after.child.get('name')).to.equal('Bob-x');
                expect(after.friends).to.equal(before.get('friends'));
            });

            it('data no longer present gets cleared', function() {
                const before = this.model;
                const after = this.model.parse({
                    name: 'Alice-x'
                });

                expect(after.name).to.equal('Alice-x');
                expect(this.model.get('child')).to.not.exist;
                expect(this.model.get('friends').length).to.equal(0);
            });

            it('data no longer present is not cleared if patch option is true', function() {
                const before = this.model;
                const after = this.model.parse({
                    name: 'Alice-x'
                }, { patch: true });

                expect(after.name).to.equal('Alice-x');
                expect(this.model.get('child')).to.exist;
                expect(this.model.get('friends').length).to.equal(2);
            });
        });
    });
});
