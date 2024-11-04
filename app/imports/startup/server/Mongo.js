import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import { WP2503 } from '../../api/WP2503/WP2503';
import { SnapshotData } from '../../api/snapshot/SnapshotCollection';
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

// Initialize the WP2503Collection if empty.
if (WP2503.count() === 0) {
  if (Meteor.settings.defaultWP2503) {
    console.log('Creating default data.');
    Meteor.settings.defaultWP2503.forEach(data => addData(data, WP2503));
  }
}

if (SnapshotData.find().count() === 0) {
  if (Meteor.settings.snapshotData) {
    console.log('Creating default data for Snapshot Data.');
    Meteor.settings.snapshotData.forEach(data => {
      console.log(`  Adding: ${data.year}`);
      SnapshotData.insert(data);
    });
  }
}
