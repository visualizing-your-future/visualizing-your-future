import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const auditedBalanceDataPublications = {
  auditedBalanceData: 'AuditedBalanceData',
  auditedBalanceDataAdmin: 'AuditedBalanceDataAdmin',
};

class AuditedBalanceDataCollection extends BaseCollection {
  constructor() {
    super('AuditedBalanceData', new SimpleSchema({
      owner: String,
      cashStuff: {
        type: Array,
        optional: true,
      },
      'cashStuff.$': Object,
      'cashStuff.$.pettyCash': { type: Number, defaultValue: 0, optional: true },
      'cashStuff.$.cash': { type: Number, defaultValue: 0, optional: true },
      'cashStuff.$.cashBankCred': { type: Number, defaultValue: 0, optional: true },
      cashTotal: { type: Number, optional: true },

      other: {
        type: Array,
        optional: true,
      },
      'other.$': Object,
      'other.$.actRec': { type: Number, defaultValue: 0, optional: true },
      'other.$.dueFromFund': { type: Number, defaultValue: 0, optional: true },
      'other.$.intDivRec': { type: Number, defaultValue: 0, optional: true },
      'other.$.invPrepaid': { type: Number, defaultValue: 0, optional: true },
      'other.$.notesDueInYr': { type: Number, defaultValue: 0, optional: true },
      'other.$.notesDueAftYr': { type: Number, defaultValue: 0, optional: true },
      'other.$.secDep': { type: Number, defaultValue: 0, optional: true },
      'other.$.cashHeldByInvMng': { type: Number, defaultValue: 0, optional: true },
      otherTotal: { type: Number, optional: true },

      investments: {
        type: Array,
        optional: true,
      },
      'investments.$': Object,
      'investments.$.mutFun': { type: Number, defaultValue: 0, optional: true },
      'investments.$.comFun': { type: Number, defaultValue: 0, optional: true },
      'investments.$.hdgFun': { type: Number, defaultValue: 0, optional: true },
      'investments.$.privEqt': { type: Number, defaultValue: 0, optional: true },
      'investments.$.comnTrustFun': { type: Number, defaultValue: 0, optional: true },
      'investments.$.comPrefStock': { type: Number, defaultValue: 0, optional: true },
      'investments.$.privDbt': { type: Number, defaultValue: 0, optional: true },
      'investments.$.other': { type: Number, defaultValue: 0, optional: true },
      investmentsTotal: { type: Number, optional: true },

      loanFund: {
        type: Array,
        optional: true,
      },
      'loanFund.$': Object,
      'loanFund.$.usTreas': { type: Number, defaultValue: 0, optional: true },
      'loanFund.$.usAgenc': { type: Number, defaultValue: 0, optional: true },
      loanFundTotal: { type: Number, optional: true },

      investLoanTotal: { type: Number, optional: true },

      assets: {
        type: Array,
        optional: true,
      },
      'assets.$': Object,
      'assets.$.bldngs': { type: Number, defaultValue: 0, optional: true },
      'assets.$.leashldImprv': { type: Number, defaultValue: 0, optional: true },
      'assets.$.frnFixEqp': { type: Number, defaultValue: 0, optional: true },
      'assets.$.accumDepr': { type: Number, defaultValue: 0, optional: true },
      assetsTotal: { type: Number, optional: true },

      land: {
        type: Array,
        optional: true,
      },
      'land.$': Object,
      'land.$.landA': { type: Number, defaultValue: 0, optional: true },
      'land.$.landB': { type: Number, defaultValue: 0, optional: true },
      'land.$.cnstrProg': { type: Number, defaultValue: 0, optional: true },
      landTotal: { type: Number, optional: true },

      compBAssets: {
        type: Array,
        optional: true,
      },
      'compBAssets.$': Object,
      'compBAssets.$.bldngs': { type: Number, defaultValue: 0, optional: true },
      'compBAssets.$.leashldImprv': { type: Number, defaultValue: 0, optional: true },
      'compBAssets.$.frnFixEqp': { type: Number, defaultValue: 0, optional: true },
      'compBAssets.$.vehcl': { type: Number, defaultValue: 0, optional: true },
      'compBAssets.$.accumDepr': { type: Number, defaultValue: 0, optional: true },
      'compBAssets.$.land': { type: Number, defaultValue: 0, optional: true },
      compBAssetsTotal: { type: Number, optional: true },

      capAssetsTotal: { type: Number, optional: true },

      rstrCash: { type: Number, optional: true },

      otherAssetsTotal: { type: Number, optional: true },

      pensionRsrcs: { type: Number, optional: true },
      OPEBRsrcs: { type: Number, optional: true },

      totAssetsAndRsrcs: { type: Number, optional: true },

    }));
  }

  /**
   * Defines a new AuditedBalanceData item.
   * @param owner the owner of the item.
   * @param cashStuff
   * @param other
   * @param investments
   * @param loanFund
   * @param assets
   * @param land
   * @param compBAssets
   * @param rstrCash
   * @param pensionRsrcs
   * @param OPEBRsrcs
   * @return {String} the docID of the new document.
   */
  define({ owner, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs }) {
    const docID = this._collection.insert({
      owner,
      cashStuff,
      other,
      investments,
      loanFund,
      assets,
      land,
      compBAssets,
      rstrCash,
      pensionRsrcs,
      OPEBRsrcs,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param cashStuff
   * @param other
   * @param investments
   * @param loanFund
   * @param assets
   * @param land
   * @param compBAssets
   * @param rstrCash
   * @param pensionRsrcs
   * @param OPEBRsrcs
   */
  update(docID, { cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs }) {
    const updateData = {};
    if (_.isArray(cashStuff)) { updateData.cashStuff = cashStuff; }
    if (_.isArray(other)) { updateData.other = other; }
    if (_.isArray(investments)) { updateData.investments = investments; }
    if (_.isArray(loanFund)) { updateData.loanFund = loanFund; }
    if (_.isArray(assets)) { updateData.assets = assets; }
    if (_.isArray(land)) { updateData.land = land; }
    if (_.isArray(compBAssets)) { updateData.compBAssets = compBAssets; }
    if (rstrCash) { updateData.rstrCash = rstrCash; }
    if (pensionRsrcs) { updateData.pensionRsrcs = pensionRsrcs; }
    if (OPEBRsrcs) { updateData.OPEBRsrcs = OPEBRsrcs; }
    this._collection.update(docID, { $set: updateData });

    // Call the updateTotals method to update the totals
    this.updateTotals(docID);
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(auditedBalanceDataPublications.auditedBalanceData, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(auditedBalanceDataPublications.auditedBalanceDataAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for AuditedBalanceData owned by the current user.
   */
  subscribeABD() {
    if (Meteor.isClient) {
      return Meteor.subscribe(auditedBalanceDataPublications.auditedBalanceData);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeABDAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(auditedBalanceDataPublications.auditedBalanceDataAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const cashStuff = doc.cashStuff;
    const other = doc.other;
    const investments = doc.investments;
    const loanFund = doc.loanFund;
    const assets = doc.assets;
    const land = doc.land;
    const compBAssets = doc.compBAssets;
    const rstrCash = doc.rstrCash;
    const pensionRsrcs = doc.pensionRsrcs;
    const OPEBRsrcs = doc.OPEBRsrcs;
    const owner = doc.owner;
    return { OPEBRsrcs, pensionRsrcs, rstrCash, compBAssets, land, assets, loanFund, investments, other, cashStuff, owner };
  }

  // Function to sum all numeric values in an array
  sumArray(array) {
    if (!array || !array.length) return 0;
    return array.reduce((total, item) => total + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
  }

  // Functions to update totals
  updateTotals(docId) {
    const doc = this.findOne(docId);
    const totalCash = this.sumArray(doc.cashStuff);
    const totalOther = this.sumArray(doc.other);
    const totalInvestments = this.sumArray(doc.investments);
    const totalLoanFund = this.sumArray(doc.loanFund);
    const totalAssets = this.sumArray(doc.assets);
    const totalLand = this.sumArray(doc.land);
    const totalCompBAssets = this.sumArray(doc.compBAssets);
    const rstrCash = doc.rstrCash;
    const pensionRsrcs = doc.pensionRsrcs;
    const OPEBRsrcs = doc.OPEBRsrcs;

    this._collection.update(docId, {
      $set: {
        cashTotal: totalCash,
        otherTotal: totalOther,
        investmentsTotal: totalInvestments,
        loanFundTotal: totalLoanFund,
        investLoanTotal: totalInvestments + totalLoanFund,
        assetsTotal: totalAssets,
        landTotal: totalLand,
        compBAssetsTotal: totalCompBAssets,
        capAssetsTotal: totalAssets + totalLand + totalCompBAssets,
        otherAssetsTotal: rstrCash + totalAssets + totalLand + totalCompBAssets + totalInvestments + totalLoanFund + totalOther,
        assetsAndRsrcsTotal: pensionRsrcs + OPEBRsrcs + rstrCash + totalAssets + totalLand + totalCompBAssets + totalInvestments + totalLoanFund + totalOther,
      },
    });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const AuditedBalanceData = new AuditedBalanceDataCollection();
