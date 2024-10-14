import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const MultiFactorAuthentication = ({ userDocument, setMfaStatus }) => {
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [mfaError, setMfaError] = useState(null);

  const handleMfaVerification = () => {
    const userPasscode = userDocument.mfaPasscode;

    if (enteredPasscode === userPasscode) {
      setMfaStatus(false); // Successfully passed MFA
      setMfaError(null);
    } else {
      setMfaError('Incorrect passcode.');
    }
  };

  return (
    <div>
      <h4>Multi-Factor Authentication</h4>
      {mfaError && <div style={{ color: 'red' }}>{mfaError}</div>}
      <input
        type="password"
        placeholder="Enter MFA Passcode"
        value={enteredPasscode}
        onChange={(e) => setEnteredPasscode(e.target.value)}
        className="form-control"
      />
      <Button onClick={handleMfaVerification} className="btn btn-primary mt-2">Verify Passcode</Button>
    </div>
  );
};

MultiFactorAuthentication.propTypes = {
  userDocument: PropTypes.shape({
    mfaPasscode: PropTypes.string,
  }).isRequired,
  setMfaStatus: PropTypes.func.isRequired,
};

export default MultiFactorAuthentication;
