import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { AuditedBalanceData } from './AuditedBalanceDataCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { MATPCollections } from '../matp/MATPCollections';
import { testDefine, testDumpRestore, testUpdate } from '../utilities/test-helpers';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

const collectionName = AuditedBalanceData.getCollectionName();

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
          fc.array(fc.record({
            pettyCash: fc.integer({ min: 0, max: 1000 }),
            cash: fc.integer({ min: 0, max: 1000 }),
            cashBankCred: fc.integer({ min: 0, max: 1000 }),
          })),
          (owner, cashStuff) => {
            const definitionData = { owner, cashStuff };
            testDefine(collection, definitionData);
          },
        ),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const owner = faker.internet.email();
      const cashStuff = [
        { pettyCash: faker.datatype.number({ min: 0, max: 1000 }), cash: faker.datatype.number({ min: 0, max: 1000 }), cashBankCred: faker.datatype.number({ min: 0, max: 1000 }) },
      ];
      const docID1 = collection.define({ owner, cashStuff });
      const docID2 = collection.define({ owner, cashStuff });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const owner = faker.lorem.words();
      const cashStuff = [
        { pettyCash: faker.datatype.number({ min: 0, max: 1000 }), cash: faker.datatype.number({ min: 0, max: 1000 }), cashBankCred: faker.datatype.number({ min: 0, max: 1000 }) },
      ];
      const docID = collection.define({
        owner,
        cashStuff,
      });
      // console.log(collection.findDoc(docID));
      fc.assert(
        fc.property(
          fc.array(fc.record({
            pettyCash: fc.integer({ min: 0, max: 1000 }),
            cash: fc.integer({ min: 0, max: 1000 }),
            cashBankCred: fc.integer({ min: 0, max: 1000 }),
          })),
          (newCashStuff) => {
            // console.log('update', index, stuffConditions[index]);
            const updateData = { cashStuff: newCashStuff };
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
