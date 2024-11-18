import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const ClientListOfWorksheetsItem = ({ profile }) => (
  <tr>
    <td>{profile.email}</td>
    <td>{profile.firstName}</td>
    <td>{profile.lastName}</td>
    <td>
      <Link className={COMPONENT_IDS.CLIENT_WORKSHEETS} to={`/dataInput/${profile.email}`}>Audited Balance</Link>
      <br />
      <Link className={COMPONENT_IDS.CLIENT_WORKSHEETS} to={`/dataInput/${profile.email}`}>WP2503 (DOES NOT WORK YET)</Link>
    </td>
  </tr>
);

// Require a document to be passed to this component.
ClientListOfWorksheetsItem.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ClientListOfWorksheetsItem;
