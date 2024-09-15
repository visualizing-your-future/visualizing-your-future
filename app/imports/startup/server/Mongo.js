import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data, collection) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  collection.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data, Stuffs));
  }
}

// Initialize the AuditedBalanceDataCollection if empty.
if (AuditedBalanceData.count() === 0) {
  if (Meteor.settings.defaultAuditedBalanceData) {
    console.log('Creating default data.');
    Meteor.settings.defaultAuditedBalanceData.forEach(data => addData(data, AuditedBalanceData));
  }
}
