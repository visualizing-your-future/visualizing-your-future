import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Modal, Form, Container, Row, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, TextField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Roles } from 'meteor/alanning:roles';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AccountantProfiles } from '../../api/user/AccountantProfileCollection';
import { BossAccountantProfiles } from '../../api/user/BossAccountantProfileCollection';
import { ClientProfiles } from '../../api/user/ClientProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
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
  // Determine if the logged-in user is an admin
  const isAdmin = Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);

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
    let sub;
    let subRdy;
    let colName;
    let userDoc;
    let
      docID;
    const usrId = Meteor.userId();
    const username = Meteor.user()?.username;
    if (Roles.userIsInRole(usrId, ROLE.ADMIN)) {
      sub = AdminProfiles.subscribeAdmin();
      subRdy = sub.ready();
      colName = AdminProfiles.getCollectionName();
      userDoc = AdminProfiles.findOne({ email: username });
      docID = AdminProfiles.getID(Meteor.user().username);
    } else if (Roles.userIsInRole(usrId, ROLE.USER)) {
      sub = UserProfiles.subscribeUserProfilesUser();
      subRdy = sub.ready();
      colName = UserProfiles.getCollectionName();
      userDoc = UserProfiles.findOne({ email: username });
      docID = UserProfiles.getID(Meteor.user().username);
    } else if (Roles.userIsInRole(usrId, ROLE.ACCOUNTANT)) {
      sub = AccountantProfiles.subscribeAccountantProfilesUser();
      subRdy = sub.ready();
      colName = AccountantProfiles.getCollectionName();
      userDoc = AccountantProfiles.findOne({ email: username });
      docID = AccountantProfiles.getID(Meteor.user().username);
    } else if (Roles.userIsInRole(usrId, ROLE.BOSSACCOUNTANT)) {
      sub = BossAccountantProfiles.subscribeBossAccountantProfilesUser();
      subRdy = sub.ready();
      colName = BossAccountantProfiles.getCollectionName();
      userDoc = BossAccountantProfiles.findOne({ email: username });
      docID = BossAccountantProfiles.getID(Meteor.user().username);
    } else if (Roles.userIsInRole(usrId, ROLE.CLIENT)) {
      sub = ClientProfiles.subscribeClientProfilesUser();
      subRdy = sub.ready();
      colName = ClientProfiles.getCollectionName();
      userDoc = ClientProfiles.findOne({ email: username });
      docID = ClientProfiles.getID(Meteor.user().username);
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

  const [showModal, setShowModal] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // checks to see if the user has typed the input correctly
  const handleInputChange = (e) => {
    const input = e.target.value;
    setTypedConfirmation(input);
    setDeleteEnabled(input === 'DELETE'); // Update as per your requirement
  };

  // Delete the current users account and redirects them after
  const handleDeleteAccount = () => {
    removeItMethod.callPromise({ collectionName, instance: documentID })
      .then(() => {
        navigate('/');
      })
      .finally(() => {
        handleCloseModal();
      });
  };

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

  // Modify the `submit` function to accept form data from the button click
  const handleSaveChanges = () => {
    const formData = {
      firstName: userDocument.firstName || '',
      lastName: userDocument.lastName || '',
      email: userDocument.email || '',
      oldPassword: '',
      newPassword: '',
      verifyNewPassword: '',
      isMFAEnabled: mfaStatus,
    };

    submit(formData); // Call the submit function with form data
  };

  // If subscription data is not ready, show a loading spinner
  if (!subReady) {
    return <LoadingSpinner />;
  }

  return (
    <Container id={PAGE_IDS.ACCOUNT_SETTINGS} className="d-flex justify-content-center align-items-center py-3">
      <Row className="justify-content-center">
        <Col>
          <Col className="text-center mb-3">
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
                <Row className="align-items-center mt-3">
                  <Col>
                    <Button
                      id={COMPONENT_IDS.SAVE_ACCOUNT_CHANGES}
                      className="btn"
                      onClick={handleSaveChanges} // Call handleSaveChanges on click
                      style={{ width: '100%' }}
                    >
                      Save Changes
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      id="modal-pop-up-button"
                      onClick={handleOpenModal}
                      className="btn"
                      style={{ width: '100%' }}
                      disabled={isAdmin}
                    >
                      Delete Account
                    </Button>
                    <Modal id={COMPONENT_IDS.DELETE_USER_ACCOUNT} show={showModal} onHide={handleCloseModal} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Confirm Account Deletion</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>
                          Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <Form>
                          <Form.Group controlId="confirmDeletion">
                            <Form.Label>
                              To confirm, type <strong>DELETE</strong> below:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={typedConfirmation}
                              onChange={handleInputChange}
                              placeholder="Type DELETE to confirm"
                            />
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                          Cancel
                        </Button>
                        <Button
                          id="delete-user-button"
                          variant="danger"
                          disabled={!deleteEnabled}
                          onClick={handleDeleteAccount}
                        >
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>

  );
};

export default AccountSettings;
