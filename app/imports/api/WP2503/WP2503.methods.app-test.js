import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { WP2503 } from './WP2503';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('WP2503Collection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = WP2503.getCollectionName();
      const definitionData = {};
      definitionData.year = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.penAcc = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.retHlthInsur = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.othrPostEmpBen = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.empHlthFnd = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.SS = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.medicare = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.wrkComp = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.unempComp = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.penAdm = faker.datatype.number({
        min: 1,
        max: 10,
      });
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(WP2503.isDefined(docID)).to.be.true;
      let doc = WP2503.findDoc(docID);
      expect(doc.year).to.equal(definitionData.year);
      expect(doc.penAcc).to.equal(definitionData.penAcc);
      expect(doc.retHlthInsur).to.equal(definitionData.retHlthInsur);
      expect(doc.othrPostEmpBen).to.equal(definitionData.othrPostEmpBen);
      expect(doc.empHlthFnd).to.equal(definitionData.empHlthFnd);
      expect(doc.SS).to.equal(definitionData.SS);
      expect(doc.medicare).to.equal(definitionData.medicare);
      expect(doc.wrkComp).to.equal(definitionData.wrkComp);
      expect(doc.unempComp).to.equal(definitionData.unempComp);
      expect(doc.penAdm).to.equal(definitionData.penAdm);
      const updateData = {};
      updateData.id = docID;
      updateData.year = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.penAcc = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.retHlthInsur = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.othrPostEmpBen = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.empHlthFnd = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.SS = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.medicare = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.wrkComp = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.unempComp = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.penAdm = faker.datatype.number({
        min: 1,
        max: 10,
      });
      await updateMethod.callPromise({ collectionName, updateData });
      doc = WP2503.findDoc(docID);
      expect(doc.year).to.equal(definitionData.year);
      expect(doc.penAcc).to.equal(definitionData.penAcc);
      expect(doc.retHlthInsur).to.equal(definitionData.retHlthInsur);
      expect(doc.othrPostEmpBen).to.equal(definitionData.othrPostEmpBen);
      expect(doc.empHlthFnd).to.equal(definitionData.empHlthFnd);
      expect(doc.SS).to.equal(definitionData.SS);
      expect(doc.medicare).to.equal(definitionData.medicare);
      expect(doc.wrkComp).to.equal(definitionData.wrkComp);
      expect(doc.unempComp).to.equal(definitionData.unempComp);
      expect(doc.penAdm).to.equal(definitionData.penAdm);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(WP2503.isDefined(docID)).to.be.false;
    });
  });
}
