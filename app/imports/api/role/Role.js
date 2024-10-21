import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

export const ROLE = {
  // Only allow account settings administration
  ADMIN: 'ADMIN',
  // Should change this to NEW_USER and remove all permissions.
  // This is the default account type that is created on sign up.
  // Admins have to manually change role to whatever (for security).
  USER: 'USER',
  // Can copy approved, audited data and modify the copy.
  // Has access to all modified data documents.
  ACCOUNTANT: 'ACCOUNTANT',
  // What do we want to allow them to see?
  CLIENT: 'CLIENT',
  // Only role that can upload and modify approved, audited data.
  CFO: 'CFO',
};

export const ROLES = _.values(ROLE);

export const isRole = (role) => (typeof role) === 'string' && (_.values(ROLE)).includes(role);

export const assertRole = (role) => {
  const roleArray = (Array.isArray(role)) ? role : [role];
  roleArray.forEach((theRole) => {
    if (!isRole(theRole)) {
      throw new Meteor.Error(`${role} is not defined, or includes at least one undefined role.`);
    }
  });
};

if (Meteor.isServer) {
  const allDefinedRoles = Roles.getAllRoles().fetch();
  const definedRoleNames = allDefinedRoles.map((role) => role.name);
  _.values(ROLE).forEach((role) => {
    if (!(definedRoleNames.includes(role))) {
      Roles.createRole(role, { unlessExists: true });
    }
  });
}
