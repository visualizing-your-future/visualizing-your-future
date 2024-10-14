import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Alert } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor'; // Added import for Meteor
import swal from 'sweetalert';
import { UserProfiles } from '../../api/user/UserProfileCollection'; // Import UserProfiles
import MultiFactorAuthentication from '../components/MultiFactorAuthentication'; // Import MFA Component
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { PAGE_IDS } from '../utilities/PageIDs';

const AccountSettings = () => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mfaStatus, setMfaStatus] = useState(false); // Store MFA status
  const [mfaPasscode, setMfaPasscode] = useState(''); // Store MFA passcode
  const [loading, setLoading] = useState(true);
  const [userDocument, setUserDocument] = useState(null);

  // Fetch user data using Meteor Tracker
  const { user, ready } = useTracker(() => {
    const subscription = Meteor.subscribe(UserProfiles.publicFieldsPublicationName); // Ensure this is defined
    return {
      user: UserProfiles.findOne({}), // Corrected to use an empty selector
      ready: subscription.ready(),
    };
  }, []);

  useEffect(() => {
    if (ready && user) {
      setUserDocument(user); // Initialize user data
      setMfaStatus(user.isMFAEnabled || false); // Initialize MFA status
      setMfaPasscode(user.mfaPasscode || ''); // Initialize passcode if already set
      setLoading(false);
    }
  }, [ready, user]);

  const handleMfaPasscodeChange = (event) => {
    setMfaPasscode(event.target.value); // Handle passcode input change
  };

  const submit = (data) => {
    // Update user's account settings, including MFA passcode and status
    const updatedData = {
      ...data,
      isMFAEnabled: mfaStatus, // Include the MFA status in the update
      mfaPasscode, // Include passcode in the update
    };

    UserProfiles.update(userDocument._id, { $set: updatedData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        setSaveSuccess(true);
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state while user data is being fetched
  }

  return (
    <Container id={PAGE_IDS.ACCOUNT_SETTINGS} className="py-3">
      <Row className="justify-content-center">
        <Col xs={8}>
          <Col className="text-center">
            <h2>Edit User Account Information</h2>
          </Col>
          {saveSuccess && (
            <Alert variant="success" onClose={() => setSaveSuccess(false)} dismissible>
              Your account settings have been saved successfully!
            </Alert>
          )}

          <AutoForm model={userDocument} onSubmit={submit}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_FIRST_NAME} name="firstName" placeholder="First Name" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_LAST_NAME} name="lastName" placeholder="Last Name" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_EMAIL} name="email" placeholder="Email" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_OLD_PASSWORD} name="oldPassword" placeholder="Old Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_NEW_PASSWORD} name="newPassword" placeholder="New Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_VERIFY_NEW_PASSWORD} name="verifyNewPassword" placeholder="Re-type New Password" type="password" />

                {/* MultiFactorAuthentication Component */}
                <MultiFactorAuthentication
                  userDocument={userDocument}
                  setMfaStatus={setMfaStatus}
                />

                <ErrorsField />
                <SubmitField value="Save Changes" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountSettings;
