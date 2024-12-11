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
      worksheetType: String,
      worksheetName: String,
      year: Number,
      cashStuff: {
        type: Array,
        optional: true,
        defaultValue: [],
      },
      'cashStuff.$': Object,
      'cashStuff.$.pettyCash': { type: Number, defaultValue: 0, optional: true },
      'cashStuff.$.cash': { type: Number, defaultValue: 0, optional: true },
      'cashStuff.$.cashBankCred': { type: Number, defaultValue: 0, optional: true },
      cashTotal: { type: Number, optional: true },

      other: {
        type: Array,
        optional: true,
        defaultValue: [],
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

      rstrCash: { type: Number, defaultValue: 0, optional: true },

      otherAssetsTotal: { type: Number, optional: true },

      pensionRsrcs: { type: Number, defaultValue: 0, optional: true },
      OPEBRsrcs: { type: Number, defaultValue: 0, optional: true },

      totAssetsAndRsrcs: { type: Number, optional: true },

      liabilities: {
        type: Array,
        optional: true,
      },
      'liabilities.$': Object,
      'liabilities.$.acntPayAccLia': { type: Number, defaultValue: 0, optional: true },
      'liabilities.$.dueToFun': { type: Number, defaultValue: 0, optional: true },
      'liabilities.$.dueToOthFun': { type: Number, defaultValue: 0, optional: true },
      liabilitiesTotal: { type: Number, optional: true },

      longTermInYear: {
        type: Array,
        optional: true,
      },
      'longTermInYear.$': Object,
      'longTermInYear.$.accrVac': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.wrkComp': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.acrManRetPln': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.acrLeasGuarOb': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.capLeasOb': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.notPayBuilA': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.netPenLia': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.netOPEBLia': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.lineOfCredA': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.lineOfCredB': { type: Number, defaultValue: 0, optional: true },
      'longTermInYear.$.debtServ': { type: Number, defaultValue: 0, optional: true },
      longTermInYearTotal: { type: Number, optional: true },

      longTermAftYear: {
        type: Array,
        optional: true,
      },
      'longTermAftYear.$': Object,
      'longTermAftYear.$.accrVac': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.wrkComp': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.acrManRetPln': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.acrLeasGuarOb': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.capLeasOb': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.notPayBuilA': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.netPenLia': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.netOPEBLia': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.lineOfCredA': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.lineOfCredB': { type: Number, defaultValue: 0, optional: true },
      'longTermAftYear.$.debtServ': { type: Number, defaultValue: 0, optional: true },
      longTermAftYearTotal: { type: Number, optional: true },

      allLiabilitiesTotal: { type: Number, optional: true },

      pensionRsrcsInflow: { type: Number, defaultValue: 0, optional: true },
      OPEBRsrcsInflow: { type: Number, defaultValue: 0, optional: true },

      liabInflowRsrcsTotal: { type: Number, optional: true },

      commitConting: {
        type: Array,
        optional: true,
      },
      'commitConting.$': Object,
      'commitConting.$.invCapAssNetDbt': { type: Number, defaultValue: 0, optional: true },
      'commitConting.$.rstrFedFun': { type: Number, defaultValue: 0, optional: true },
      'commitConting.$.unRstr': { type: Number, defaultValue: 0, optional: true },
      totalNet: { type: Number, optional: true },

      totalLiabInRsrc: { type: Number, optional: true },

      revenue: {
        type: Array,
        optional: true,
      },
      'revenue.$': Object,
      'revenue.$.investPort': { type: Number, defaultValue: 0, optional: true },
      'revenue.$.revs': { type: Number, defaultValue: 0, optional: true },
      'revenue.$.genFund': { type: Number, defaultValue: 0, optional: true },
      'revenue.$.coreOpBudget': { type: Number, defaultValue: 0, optional: true },
      revenueTotal: { type: Number, optional: true },

      expenses: {
        type: Array,
        optional: true,
      },
      'expenses.$': Object,
      'expenses.$.personnel': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.program': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.contracts': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.grants': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.travel': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.equip': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.overhead': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.deptServ': { type: Number, defaultValue: 0, optional: true },
      'expenses.$.other': { type: Number, defaultValue: 0, optional: true },
      expensesTotal: { type: Number, optional: true },

      salary: { type: Number, defaultValue: 0, optional: true },
      management: { type: Number, defaultValue: 0, optional: true },
      supServ: { type: Number, defaultValue: 0, optional: true },
      benAdv: { type: Number, defaultValue: 0, optional: true },
    }));
  }

  define({ owner, worksheetName, year, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear,
    pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv }) {
    const docID = this._collection.insert({
      owner, worksheetType: 'Audited Balance Data', worksheetName, year, cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear,
      pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv,
    });
    this.updateTotals(docID);
    return docID;
  }

  update(docID, { cashStuff, other, investments, loanFund, assets, land, compBAssets, rstrCash, pensionRsrcs, OPEBRsrcs, liabilities, longTermInYear, longTermAftYear,
    pensionRsrcsInflow, OPEBRsrcsInflow, commitConting, revenue, expenses, salary, management, supServ, benAdv }) {
    const updateData = {};
    if (_.isArray(cashStuff)) { updateData.cashStuff = cashStuff; }
    if (_.isArray(other)) { updateData.other = other; }
    if (_.isArray(investments)) { updateData.investments = investments; }
    if (_.isArray(loanFund)) { updateData.loanFund = loanFund; }
    if (_.isArray(assets)) { updateData.assets = assets; }
    if (_.isArray(land)) { updateData.land = land; }
    if (_.isArray(compBAssets)) { updateData.compBAssets = compBAssets; }
    updateData.rstrCash = rstrCash;
    updateData.pensionRsrcs = pensionRsrcs;
    updateData.OPEBRsrcs = OPEBRsrcs;
    if (_.isArray(liabilities)) { updateData.liabilities = liabilities; }
    if (_.isArray(longTermInYear)) { updateData.longTermInYear = longTermInYear; }
    if (_.isArray(longTermAftYear)) { updateData.longTermAftYear = longTermAftYear; }
    updateData.pensionRsrcsInflow = pensionRsrcsInflow;
    updateData.OPEBRsrcsInflow = OPEBRsrcsInflow;
    if (_.isArray(commitConting)) { updateData.commitConting = commitConting; }
    if (_.isArray(revenue)) { updateData.revenue = revenue; }
    if (_.isArray(expenses)) { updateData.expenses = expenses; }
    updateData.salary = salary;
    updateData.management = management;
    updateData.supServ = supServ;
    updateData.benAdv = benAdv;
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
        if (this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ACCOUNTANT, ROLE.BOSSACCOUNTANT])) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for AuditedBalanceData owned by the current user.
   */
  subscribeAudBalData() {
    if (Meteor.isClient) {
      return Meteor.subscribe(auditedBalanceDataPublications.auditedBalanceData);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeAudBalDataAdmin() {
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ACCOUNTANT, ROLE.BOSSACCOUNTANT]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const cashStuff = doc.cashStuff;
    const cashTotal = doc.cashTotal;
    const other = doc.other;
    const otherTotal = doc.otherTotal;
    const investments = doc.investments;
    const investmentsTotal = doc.investmentsTotal;
    const loanFund = doc.loanFund;
    const loanFundTotal = doc.loanFundTotal;
    const investLoanTotal = doc.investLoanTotal;
    const assets = doc.assets;
    const assetsTotal = doc.assetsTotal;
    const land = doc.land;
    const landTotal = doc.landTotal;
    const compBAssets = doc.compBAssets;
    const compBAssetsTotal = doc.compBAssetsTotal;
    const capAssetsTotal = doc.capAssetsTotal;
    const rstrCash = doc.rstrCash;
    const otherAssetsTotal = doc.otherAssetsTotal;
    const pensionRsrcs = doc.pensionRsrcs;
    const OPEBRsrcs = doc.OPEBRsrcs;
    const totAssetsAndRsrcs = doc.totAssetsAndRsrcs;
    const liabilities = doc.liabilities;
    const liabilitiesTotal = doc.liabilitiesTotal;
    const longTermInYear = doc.longTermInYear;
    const longTermInYearTotal = doc.longTermInYearTotal;
    const longTermAftYear = doc.longTermAftYear;
    const longTermAftYearTotal = doc.longTermAftYearTotal;
    const allLiabilitiesTotal = doc.allLiabilitiesTotal;
    const pensionRsrcsInflow = doc.pensionRsrcsInflow;
    const OPEBRsrcsInflow = doc.OPEBRsrcsInflow;
    const liabInflowRsrcsTotal = doc.liabInflowRsrcsTotal;
    const commitConting = doc.commitConting;
    const totalNet = doc.totalNet;
    const totalLiabInRsrc = doc.totalLiabInRsrc;
    const revenue = doc.revenue;
    const revenueTotal = doc.revenueTotal;
    const expenses = doc.expenses;
    const expensesTotal = doc.expensesTotal;
    const salary = doc.salary;
    const management = doc.management;
    const supServ = doc.supServ;
    const benAdv = doc.benAdv;
    const year = doc.year;
    const owner = doc.owner;
    const worksheetType = doc.worksheetType;
    const worksheetName = doc.worksheetName;
    return {
      totalLiabInRsrc, totalNet, commitConting, liabInflowRsrcsTotal, OPEBRsrcsInflow, pensionRsrcsInflow, allLiabilitiesTotal, longTermAftYearTotal, longTermAftYear,
      longTermInYearTotal, longTermInYear, liabilitiesTotal, liabilities, totAssetsAndRsrcs, OPEBRsrcs, pensionRsrcs, otherAssetsTotal, rstrCash, capAssetsTotal, compBAssetsTotal,
      compBAssets, landTotal, land, assetsTotal, assets, investLoanTotal, loanFundTotal, loanFund, investmentsTotal, investments, otherTotal, other, cashTotal, cashStuff,
      revenue, revenueTotal, expenses, expensesTotal, salary, management, supServ, benAdv, year, owner, worksheetType, worksheetName };
  }

  sumArray(array) {
    if (!array || !array.length) return 0;
    return array.reduce((total, item) => total + Object.values(item).reduce((innerSum, value) => innerSum + (typeof value === 'number' ? value : 0), 0), 0);
  }

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
    const totalLiab = this.sumArray(doc.liabilities);
    const totalLongTermInYear = this.sumArray(doc.longTermInYear);
    const totalLongTermAftYear = this.sumArray(doc.longTermAftYear);
    const pensionRsrcsInflow = doc.pensionRsrcsInflow;
    const OPEBRsrcsInflow = doc.OPEBRsrcsInflow;
    const totalCommitConting = this.sumArray(doc.commitConting);
    const totalRevenue = this.sumArray(doc.revenue);
    const totalExpenses = this.sumArray(doc.expenses);

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
        liabilitiesTotal: totalLiab,
        longTermInYearTotal: totalLongTermInYear,
        longTermAftYearTotal: totalLongTermAftYear,
        allLiabilitiesTotal: totalLiab + totalLongTermInYear + totalLongTermAftYear,
        liabInflowRsrcsTotal: totalLiab + totalLongTermInYear + totalLongTermAftYear + pensionRsrcsInflow + OPEBRsrcsInflow,
        totalNet: totalCommitConting,
        totalLiabInRsrc: totalLiab + totalLongTermInYear + totalLongTermAftYear + pensionRsrcsInflow + OPEBRsrcsInflow + totalCommitConting,
        revenueTotal: totalRevenue,
        expensesTotal: totalExpenses,
      },
    });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const AuditedBalanceData = new AuditedBalanceDataCollection();
