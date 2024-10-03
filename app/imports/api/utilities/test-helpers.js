import { expect } from 'chai';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

export const testDefine = (collection, definitionData) => {
  const docID = collection.define(definitionData);
  expect(collection.isDefined(docID)).to.be.true;
  collection.removeIt(docID);
  expect(collection.isDefined(docID)).to.be.false;
};

export const testUpdate = (collection, docID, updateData) => {
  collection.update(docID, updateData);
  const item = collection.findDoc(docID);
  const keys = Object.keys(updateData);
  keys.forEach(key => expect(item[key]).to.equal(updateData[key]));
};

export const testDataUpdate = (collection, docID, updateData) => {
  collection.update(docID, updateData);
  const item = collection.findDoc(docID);
  const keys = ['cashStuff', 'other', 'investments', 'loanFund', 'assets', 'land', 'compBAssets', 'rstrCash', 'pensionRsrcs', 'OPEBRsrcs', 'liabilities', 'longTermInYear', 'longTermAftYear', 'pensionRsrcsInflow', 'OPEBRsrcsInflow', 'commitConting'];
  keys.forEach(key => { expect(item[key]).to.deep.equal(updateData[key]); });
};

export const testDumpRestore = (collection) => {
  const origDoc = collection.findOne({});
  let docID = origDoc._id;
  const dumpObject = collection.dumpOne(docID);
  collection.removeIt(docID);
  expect(collection.isDefined(docID)).to.be.false;
  docID = collection.restoreOne(dumpObject);
  expect(collection.isDefined(docID)).to.be.true;
  const doc = collection.findDoc(docID);
  const keys = Object.keys(doc);
  keys.forEach(key => {
    if (key !== '_id') {
      expect(doc[key]).to.deep.equal(origDoc[key]);
    }
  });
};
