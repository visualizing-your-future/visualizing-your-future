import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { WP2503 } from './WP2503';
import { removeAllEntities } from '../base/BaseUtilities';
import { MATPCollections } from '../matp/MATPCollections';
import { testDefine, testDumpRestore, testUpdate } from '../utilities/test-helpers';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = WP2503.getCollectionName();

if (Meteor.isServer) {
  describe(collectionName, function testSuite() {
    const collection = MATPCollections.getCollection(collectionName);

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(
          fc.lorem({ maxCount: 1 }),
          fc.lorem({ maxCount: 1 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          (owner, worksheetName, year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm) => {
            const definitionData = { owner, worksheetName, year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm };
            testDefine(collection, definitionData);
          },
        ),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const owner = faker.internet.email();
      const worksheetName = faker.lorem.words();
      const year = faker.datatype.number({ min: 1, max: 5 });
      const penAcc = faker.datatype.number({ min: 1, max: 5 });
      const retHlthInsur = faker.datatype.number({ min: 1, max: 5 });
      const othrPostEmpBen = faker.datatype.number({ min: 1, max: 5 });
      const empHlthFnd = faker.datatype.number({ min: 1, max: 5 });
      const SS = faker.datatype.number({ min: 1, max: 5 });
      const medicare = faker.datatype.number({ min: 1, max: 5 });
      const wrkComp = faker.datatype.number({ min: 1, max: 5 });
      const unempComp = faker.datatype.number({ min: 1, max: 5 });
      const penAdm = faker.datatype.number({ min: 1, max: 5 });
      const docID1 = collection.define({ owner, worksheetName, year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm });
      const docID2 = collection.define({ owner, worksheetName, year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const owner = faker.internet.email();
      const worksheetName = faker.lorem.words();
      const year = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const penAcc = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const retHlthInsur = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const othrPostEmpBen = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const empHlthFnd = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const SS = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const medicare = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const wrkComp = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const unempComp = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const penAdm = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const docID = collection.define({
        owner,
        worksheetName,
        year,
        penAcc,
        retHlthInsur,
        othrPostEmpBen,
        empHlthFnd,
        SS,
        medicare,
        wrkComp,
        unempComp,
        penAdm,
      });
      // console.log(collection.findDoc(docID));
      fc.assert(
        fc.property(
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          fc.integer({ max: 10 }),
          (newYear, newPenAcc, newRetHlthInsur, newOthrPostEmpBen, newEmpHlthFnd, newSS, newMedicare, newWrkComp, newUnempComp, newPenAdm) => {
            const updateData = {
              year: newYear,
              penAcc: newPenAcc,
              retHlthInsur: newRetHlthInsur,
              othrPostEmpBen: newOthrPostEmpBen,
              empHlthFnd: newEmpHlthFnd,
              SS: newSS,
              medicare: newMedicare,
              wrkComp: newWrkComp,
              unempComp: newUnempComp,
              penAdm: newPenAdm };
            testUpdate(collection, docID, updateData);
          },
        ),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      testDumpRestore(collection);
    });
  });
}
