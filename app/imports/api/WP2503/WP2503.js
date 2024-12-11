import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const wp2503Publications = {
  wp2503: 'WP2503',
  wp2503Admin: 'WP2503Admin',
};

class WP2503Collection extends BaseCollection {
  constructor() {
    super('WP2503', new SimpleSchema({
      owner: String,
      worksheetType: String,
      worksheetName: String,
      year: Number,
      penAcc: Number,
      retHlthInsur: Number,
      othrPostEmpBen: Number,
      empHlthFnd: Number,
      SS: Number,
      medicare: Number,
      wrkComp: Number,
      unempComp: Number,
      penAdm: Number,
    }));
  }

  /**
   * Defines a new WP2503 item.
   * @param name the name of the item.
   */
  define({ owner, worksheetName, year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm }) {
    const docID = this._collection.insert({
      owner, worksheetType: '2503', worksheetName, year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param year the new name (optional).
   * @param penAcc the new name (optional).
   * @param retHlthInsur the new name (optional).
   * @param othrPostEmpBen the new name (optional).
   * @param empHlthFnd the new name (optional).
   * @param SS the new name (optional).
   * @param medicare the new name (optional).
   * @param wrkComp the new name (optional).
   * @param unempComp the new name (optional).
   * @param penAdm the new name (optional).
   */
  update(docID, { year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm }) {
    const updateData = {};
    if (_.isNumber(year)) {
      updateData.year = year;
    }
    if (_.isNumber(penAcc)) {
      updateData.penAcc = penAcc;
    }
    if (_.isNumber(retHlthInsur)) {
      updateData.retHlthInsur = retHlthInsur;
    }
    if (_.isNumber(othrPostEmpBen)) {
      updateData.othrPostEmpBen = othrPostEmpBen;
    }
    if (_.isNumber(empHlthFnd)) {
      updateData.empHlthFnd = empHlthFnd;
    }
    if (_.isNumber(SS)) {
      updateData.SS = SS;
    }
    if (_.isNumber(medicare)) {
      updateData.medicare = medicare;
    }
    if (_.isNumber(wrkComp)) {
      updateData.wrkComp = wrkComp;
    }
    if (_.isNumber(unempComp)) {
      updateData.unempComp = unempComp;
    }
    if (_.isNumber(penAdm)) {
      updateData.penAdm = penAdm;
    }
    this._collection.update(docID, { $set: updateData });
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
      // get the WP2503Collection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(wp2503Publications.wp2503, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(wp2503Publications.wp2503Admin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ACCOUNTANT, ROLE.BOSSACCOUNTANT])) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeWP2503() {
    if (Meteor.isClient) {
      return Meteor.subscribe(wp2503Publications.wp2503);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeWP2503Admin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(wp2503Publications.wp2503Admin);
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
    const owner = doc.owner;
    const worksheetType = doc.worksheetType;
    const worksheetName = doc.worksheetName;
    const year = doc.year;
    const penAcc = doc.penAcc;
    const retHlthInsur = doc.retHlthInsur;
    const othrPostEmpBen = doc.othrPostEmpBen;
    const empHlthFnd = doc.empHlthFnd;
    const SS = doc.SS;
    const medicare = doc.medicare;
    const wrkComp = doc.wrkComp;
    const unempComp = doc.unempComp;
    const penAdm = doc.penAdm;
    return { owner, worksheetType, worksheetName, year, penAcc, retHlthInsur, othrPostEmpBen, empHlthFnd, SS, medicare, wrkComp, unempComp, penAdm };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const WP2503 = new WP2503Collection();
