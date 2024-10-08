import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseProfileCollection from './BaseProfileCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

class AdminProfileCollection extends BaseProfileCollection {
  constructor() {
    super('AdminProfile', new SimpleSchema({}));
  }

  /**
   * Defines the profile associated with an Admin and the associated Meteor account.
   * @param email The email associated with this profile. Will be the username.
   * @param password The password for this user.
   * @param firstName The first name.
   * @param lastName The last name.
   */
  define({ email, firstName, lastName, password }) {
    if (Meteor.isServer) {
      // console.log('define', email, firstName, lastName, password);
      const username = email;
      const user = this.findOne({ email, firstName, lastName });
      if (!user) {
        const role = ROLE.ADMIN;
        const profileID = this._collection.insert({ email, firstName, lastName, userID: this.getFakeUserId(), role });
        const userID = Users.define({ username, role, password });
        this._collection.update(profileID, { $set: { userID } });
        return profileID;
      }
      return user._id;
    }
    return undefined;
  }

  /**
   * Updates the following values in an admin's  AdminProfile. You cannot change the email or role.
   *
   * @param docID the id of the AdminProfile.
   * @param userID the associated User ID.
   * @param firstName new first name (optional).
   * @param lastName new last name (optional).
   * @param email new email (optional).
   */
  update(docID, { userID, firstName, lastName, email }) {
    if (Meteor.isServer) {
      this.assertDefined(docID);
      const updateData = {};
      if (firstName) {
        updateData.firstName = firstName;
      }
      if (lastName) {
        updateData.lastName = lastName;
      }
      if (email) {
        updateData.email = email;
        /** Sign in checks meteor/accounts-base, not BaseProfileCollection schema. */
        Users.updateUsernameAndEmail(userID, email);
      }
      this._collection.update(docID, { $set: updateData });
    }
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    // TODO: This line always returns undefined.  Why?
    check(doc, Object);
    // LEAVE THESE CONSOLE.LOGS IN FOR NOW.  THEY ARE USEFUL FOR DEBUGGING.
    // console.log('before', this._collection.findOne({ _id: doc._id }));
    this._collection.remove(doc._id);
    // console.log('after', this._collection.findOne({ _id: doc._id }));
    // console.log('before', Meteor.users.findOne({ _id: doc.userID }));
    Meteor.users.remove({ _id: doc.userID });
    // console.log('after', Meteor.users.findOne({ _id: doc.userID }));
    return true;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(this._collectionName);
    }
    return null;
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Admin.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Admin.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the profile common fields and the role..
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (doc.role !== ROLE.ADMIN) {
        problems.push(`AdminProfile instance does not have ROLE.ADMIN: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the AdminProfile docID in a format acceptable to define().
   * @param docID The docID of a AdminProfile
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const email = doc.email;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    return { email, firstName, lastName }; // CAM this is not enough for the define method. We lose the password.
  }
}

/**
 * Profides the singleton instance of this class to all other entities.
 * @type {AdminProfileCollection}
 */
export const AdminProfiles = new AdminProfileCollection();
