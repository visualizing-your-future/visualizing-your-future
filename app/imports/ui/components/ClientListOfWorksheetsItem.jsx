import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const ClientListOfWorksheetsItem = ({ profile }) => (
  <tr>
    <td>{profile.clientEmail}</td>
    <td>
      {profile.worksheetsAuditedBalance.map((worksheet) => (
        <Link className={COMPONENT_IDS.CLIENT_WORKSHEETS} to={`/dataInput/${profile.clientEmail}/${worksheet}`}>{worksheet}<br /></Link>
      ))}
    </td>
  </tr>
);

// Require a document to be passed to this component.
ClientListOfWorksheetsItem.propTypes = {
  profile: PropTypes.shape({
    clientEmail: PropTypes.string,
    worksheetsAuditedBalance: PropTypes.string,
    worksheets2503: PropTypes.string,
    // lastName: PropTypes.string,
    // role: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ClientListOfWorksheetsItem;
