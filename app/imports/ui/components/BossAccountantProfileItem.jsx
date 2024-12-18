import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Profiles table. See pages/ListProfiles.jsx. */

const BossAccountantProfileItem = ({ profile }) => (
  <tr>
    <td>{profile.email}</td>
    <td>{profile.firstName}</td>
    <td>{profile.lastName}</td>
    <td>{profile.role}</td>
    <td>{profile.clients.toString() || 'No ClientList'}</td>
    <td>
      <Link className={COMPONENT_IDS.LIST_PROFILES_EDIT} to={`/edit/${profile._id}`}>Edit</Link>
    </td>
  </tr>
);

// Require a document to be passed to this component.
BossAccountantProfileItem.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.string,
    clients: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }).isRequired,
};

export default BossAccountantProfileItem;
