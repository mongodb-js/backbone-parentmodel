'use strict';

const Backbone = require('backbone');
const _ = require('underscore');

const chai = require('chai');
const expect = chai.expect;

const ParentModel = require('../../src/ParentModel');

describe('ParentModel', function() {

    context('when using as extended Backbone.Model', function() {
        beforeEach(function() {
            this.model = new ParentModel();
        });

        it('should contain additional ParentModel functions', function() {
            const prototype = this.model.__proto__;
            expect(prototype.createChildModel).to.exist;
            expect(prototype.createChildCollection).to.exist;
            expect(prototype.getChild).to.exist;
            expect(prototype.setChild).to.exist;
            expect(prototype.getAttributes).to.exist;
        });
    });
});
