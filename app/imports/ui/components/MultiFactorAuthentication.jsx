import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BoolField } from 'uniforms-bootstrap5';
import { Alert } from 'react-bootstrap';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * MultiFactorAuthentication Component
 * This component manages the Multi-Factor Authentication (MFA) settings for the user.
 * It allows the user to enable or disable MFA and reflects the current status.
 *
 * Props:
 * - userDocument: The user's profile document, which contains information like their email and MFA status.
 * - setMfaStatus: A function to update the MFA status in the parent component (AccountSettings).
 */
const MultiFactorAuthentication = ({ userDocument, setMfaStatus }) => {
  // Local state to track if MFA is enabled or disabled
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);

  /**
   * useEffect Hook
   * - Runs when the component mounts or when the `userDocument` prop changes.
   * - Initializes the `isMFAEnabled` state based on the value in `userDocument` or from localStorage (fallback).
   */
  useEffect(() => {
    if (userDocument?.isMFAEnabled !== undefined) {
      // If MFA status is available in `userDocument`, use it to set the local state
      setIsMFAEnabled(userDocument.isMFAEnabled);
    } else {
      // If no MFA status in `userDocument`, fall back to stored MFA status from localStorage
      const storedMFA = localStorage.getItem('isMFAEnabled') === 'true';
      setIsMFAEnabled(storedMFA);
    }
  }, [userDocument]); // Runs every time `userDocument` changes

  /**
   * handleMFAChange Function
   * - Updates the local `isMFAEnabled` state when the user toggles the MFA setting.
   * - Calls `setMfaStatus` from the parent component to update the global MFA status.
   * - Saves the new MFA status to localStorage for persistence.
   */
  const handleMFAChange = (newStatus) => {
    setIsMFAEnabled(newStatus); // Update local state
    setMfaStatus(newStatus); // Call the parent function to update global state
    localStorage.setItem('isMFAEnabled', newStatus); // Store the new status in localStorage
  };

  return (
    <>
      {/* BoolField component: A checkbox field for toggling MFA on or off */}
      <BoolField
        id={COMPONENT_IDS.ACCOUNT_SETTINGS_MFA}
        name="isMFAEnabled"
        label="Enable Multi-Factor Authentication"
        value={isMFAEnabled}
        onChange={handleMFAChange} // Update MFA status on change
      />

      {/* Display the current MFA status to the user */}
      <Alert variant="info">
        Multi-Factor Authentication is currently <strong>{isMFAEnabled ? 'enabled' : 'disabled'}</strong>.
      </Alert>
    </>
  );
};

// Define PropTypes for validation
MultiFactorAuthentication.propTypes = {
  /**
   * userDocument: The user's profile object.
   * - email: User's email address as a string.
   * - isMFAEnabled: Boolean indicating whether MFA is enabled or not.
   */
  userDocument: PropTypes.shape({
    email: PropTypes.string, // Email as a string
    isMFAEnabled: PropTypes.bool, // MFA enabled status as a boolean
  }).isRequired,

  /**
   * setMfaStatus: Function to update the MFA status in the parent component.
   */
  setMfaStatus: PropTypes.func.isRequired,
};

export default MultiFactorAuthentication;
