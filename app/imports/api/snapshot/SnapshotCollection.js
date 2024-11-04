import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const SnapshotSchema = new SimpleSchema({
  year: { type: String },
  assets: { type: Number },
  liabilities: { type: Number },
  netPosition: { type: Number },
  cashOnHand: { type: Number },
  debt: { type: Number },
  opex: { type: Number },
  liquidity: { type: Number },
  perpetuity: { type: Number, optional: true },
  cashInFlow: { type: Number },
  cashOutFlow: { type: Number },
  netCashFlow: { type: Number },
  budget: { type: Number, optional: true },
  actualAndEncumbrance: { type: Number, optional: true },
  changeAE: { type: Number, optional: true },
});

export const SnapshotData = new Mongo.Collection('snapshotData');

// Attach the schema to the collection
SnapshotData.attachSchema(SnapshotSchema);
