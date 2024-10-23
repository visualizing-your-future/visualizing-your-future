import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Roles } from 'meteor/alanning:roles';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';
import MultiFactorAuthentication from '../components/MultiFactorAuthentication';
import SecurityQuestions from '../components/SecurityQuestions'; // Import the MFA component

/**
 * AccountSettings Component
 * This component allows users to update their account settings, including their name, email, password, and MFA status.
 * The user data is retrieved based on their role (admin or user).
 */
const AccountSettings = () => {
  // Set the page title
  document.title = 'Visualizing Your Future - Account Settings';

  const navigate = useNavigate();

  // Define schema for the form using SimpleSchema for validation
  const schema = new SimpleSchema({
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    email: { type: String, optional: true },
    oldPassword: { type: String, optional: true },
    newPassword: { type: String, optional: true },
    verifyNewPassword: { type: String, optional: true },
    isMFAEnabled: { type: Boolean, optional: true, defaultValue: false },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /**
   * useTracker Hook
   * - Fetches the current user's document based on their role (admin or user).
   * - Subscribes to the appropriate profile collection (AdminProfiles or UserProfiles).
   */
  const { userID, subReady, collectionName, userDocument, documentID } = useTracker(() => {
    let sub; let subRdy; let colName; let userDoc; let
      docID;
    const usrId = Meteor.userId();
    const username = Meteor.user()?.username;

    if (Roles.userIsInRole(usrId, ROLE.ADMIN)) {
      // Subscription for admin users
      sub = AdminProfiles.subscribeAdmin();
      subRdy = sub.ready();
      colName = AdminProfiles.getCollectionName();
      userDoc = AdminProfiles.findOne({ email: username });
      docID = AdminProfiles.getID(Meteor.user().username);
    } else if (Roles.userIsInRole(usrId, ROLE.USER)) {
      // Subscription for regular users
      sub = UserProfiles.subscribeUserProfilesUser();
      subRdy = sub.ready();
      colName = UserProfiles.getCollectionName();
      userDoc = UserProfiles.findOne({ email: username });
      docID = UserProfiles.getID(Meteor.user().username);
    } else {
      // If not authorized, navigate to 'notauthorized' page
      navigate('/notauthorized');
    }

    return {
      userID: usrId,
      subReady: subRdy,
      collectionName: colName,
      userDocument: userDoc,
      documentID: docID,
    };
  }, []);

  const [saveSuccess, setSaveSuccess] = useState(false); // Track whether the save was successful
  const [mfaStatus, setMfaStatus] = useState(false); // Local state for MFA status
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  /**
   * useEffect Hook
   * - Syncs the `mfaStatus` with the user document or localStorage.
   * - Runs when `userDocument` changes.
   */
  useEffect(() => {
    if (userDocument?.isMFAEnabled !== undefined) {
      setMfaStatus(userDocument.isMFAEnabled);
    } else {
      const storedMFA = localStorage.getItem('isMFAEnabled') === 'true';
      setMfaStatus(storedMFA);
    }
  }, [userDocument]);

  /**
   * submit Function
   * - Handles form submission to update user account settings.
   * - Updates user profile data including the MFA status.
   */
  const submit = (data) => {
    if (!Meteor.user()) {
      swal('Error', 'You are not logged in.', 'error');
      return;
    }

    const { firstName, lastName, email, oldPassword, newPassword, verifyNewPassword, isMFAEnabled } = data;

    // Handle password change if provided
    if (oldPassword && newPassword === verifyNewPassword) {
      Meteor.call('users.changePassword', oldPassword, newPassword, (err) => {
        if (err) {
          swal('Error', 'Password change failed.', 'error');
        } else {
          swal('Success', 'Password changed successfully.', 'success');
        }
      });
    } else if (oldPassword && newPassword !== verifyNewPassword) {
      swal('Error', 'Passwords do not match.', 'error');
      return;
    }

    // Prepare data for updating the user's profile
    const updateData = { id: documentID, userID, firstName, lastName, email, isMFAEnabled };
    updateMethod.callPromise({ collectionName: collectionName, updateData })
      .then(() => {
        setMfaStatus(isMFAEnabled);
        swal('Success', `Account settings updated. MFA is now ${isMFAEnabled ? 'enabled' : 'disabled'}.`, 'success');
        setSaveSuccess(true);
      })
      .catch(error => swal('Error', error.message, 'error'));

    localStorage.setItem('isMFAEnabled', isMFAEnabled); // Persist MFA status in localStorage
  };

  // If subscription data is not ready, show a loading spinner
  if (!subReady) {
    return <LoadingSpinner />;
  }

  return (
    <Container id={PAGE_IDS.ACCOUNT_SETTINGS} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit User Account Information</h2>
          </Col>
          {saveSuccess && (
            <Alert variant="success" onClose={() => setSaveSuccess(false)} dismissible>
              Your account settings have been saved successfully!
            </Alert>
          )}

          {/* AutoForm to handle user profile settings */}
          <AutoForm model={{ ...userDocument, isMFAEnabled: mfaStatus }} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_FIRST_NAME} name="firstName" placeholder="First Name" />
                  </Col>
                  <Col md={6}>
                    <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_LAST_NAME} name="lastName" placeholder="Last Name" />
                  </Col>
                </Row>
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_EMAIL} name="email" placeholder="Email" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_OLD_PASSWORD} name="oldPassword" placeholder="Old Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_NEW_PASSWORD} name="newPassword" placeholder="New Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_VERIFY_NEW_PASSWORD} name="verifyNewPassword" placeholder="Re-type New Password" type="password" />

                {/* Call the MultiFactorAuthentication component to handle MFA */}
                <MultiFactorAuthentication
                  userDocument={userDocument}
                  setMfaStatus={setMfaStatus}
                />
                {/* Security Questions Component */}
                {mfaStatus && (
                  <SecurityQuestions
                    securityQuestion={securityQuestion}
                    setSecurityQuestion={setSecurityQuestion}
                    securityAnswer={securityAnswer}
                    setSecurityAnswer={setSecurityAnswer}
                  />
                )}
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SAVE_ACCOUNT_CHANGES} value="Save Changes" />
                <Button
                  id={COMPONENT_IDS.DELETE_USER_ACCOUNT}
                  onClick={() => {
                    removeItMethod.callPromise({ collectionName: collectionName, instance: documentID });
                    navigate('/');
                  }}
                >
                  Delete Account
                </Button>
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountSettings;
