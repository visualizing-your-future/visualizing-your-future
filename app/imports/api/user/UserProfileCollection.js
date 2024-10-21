import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseProfileCollection from './BaseProfileCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';
import { AdminProfiles } from './AdminProfileCollection';

export const profilePublications = {
  profile: 'Profile',
  profileAdmin: 'ProfileAdmin',
};

class UserProfileCollection extends BaseProfileCollection {
  constructor() {
    super('UserProfile', new SimpleSchema({}));
  }

  /**
   * Defines the profile associated with an User and the associated Meteor account.
   * @param email The email associated with this profile. Will be the username.
   * @param password The password for this user.
   * @param firstName The first name.
   * @param lastName The last name.
   */
  define({ email, firstName, lastName, password }) {
    if (Meteor.isServer) {
      const username = email;
      const user = this.findOne({ email, firstName, lastName });
      if (!user) {
        const role = ROLE.USER;
        /** Creates a Meteor account. */
        const userID = Users.define({ username, role, password });
        /** Creates a MongoDB UserProfileCollection account. */
        const profileID = this._collection.insert({ email, firstName, lastName, role, userID });
        // this._collection.update(profileID, { $set: { userID } });
        return profileID;
      }
      return user._id;
    }
    return undefined;
  }

  /**
   * Verifies user does not exist in this collection, then adds them.
   * @param userID User's Meteor.users._id.
   * @param email User's email
   * @param firstName User's first name.
   * @param lastName User's last name.
   */
  changeRoleDefine({ userID, email, firstName, lastName }) {
    if (Meteor.isServer) {
      const user = this.findOne({ email, firstName, lastName });
      if (!user) {
        const role = ROLE.USER;
        return this._collection.insert({ email, firstName, lastName, role, userID });
      }
      return user._id;
    }
    return undefined;
  }

  /**
   * Updates the following values in a user's UserProfile.
   * @param docID the _id of the User's profile in the User collection.
   * @param userID User's Meteor.users._id (will not change).
   * @param firstName (New) first name.
   * @param lastName (New) last name.
   * @param email (New) email.
   * @param role (New) role.
   */
  update(docID, { userID, firstName, lastName, email, role }) {
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
        // Sign in checks meteor/accounts-base, not BaseProfileCollection schema.
        Users.updateUsernameAndEmail(userID, email);
      }
      /** Leaving this extra if statement for now, I plan to add more roles, like customer. */
      if (role !== 'User') {
        if (role === 'Admin') {
          // Change role in Meteor.users
          Users.changeRole(userID, ROLE.ADMIN);
          // Add user to new admin profiles collection
          AdminProfiles.changeRoleDefine({ userID, email, firstName, lastName });
          // Remove user from user profiles collection
          this._collection.remove(docID);
        }
      }
      this._collection.update(docID, { $set: updateData });
    }
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } docID A document or docID in this collection.
   * @returns true
   */
  removeIt(docID) {
    const doc = this.findDoc(docID);
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
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(profilePublications.profile, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ email: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(profilePublications.profileAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for users.
   * It subscribes to the entire collection?
   */
  subscribeProfileUser() {
    if (Meteor.isClient) {
      return Meteor.subscribe(profilePublications.profile);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeProfileAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(profilePublications.profileAdmin);
    }
    return null;
  }

  /**
   * TODO CAM: Update this documentation since we want to be able to sign up new users.
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod() {
    // this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
    return true;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the profile common fields and the role.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (doc.role !== ROLE.User) {
        problems.push(`UserProfile instance does not have ROLE.USER: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the UserProfile docID in a format acceptable to define().
   * @param docID The docID of a UserProfile
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
 * Provides the singleton instance of this class to all other entities.
 * @type {UserProfileCollection}
 */
export const UserProfiles = new UserProfileCollection();
