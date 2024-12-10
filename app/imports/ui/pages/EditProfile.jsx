import React, { useState } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row, Button, Modal, Form, Alert } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AccountantProfiles } from '../../api/user/AccountantProfileCollection';
import { ClientProfiles } from '../../api/user/ClientProfileCollection';
import { BossAccountantProfiles } from '../../api/user/BossAccountantProfileCollection';

/* Renders the EditProfile page for editing a single document. */
const EditProfile = () => {
  document.title = 'Edit User Profile';
  const _docId = useParams();
  const navigate = useNavigate();
  const roleTypes = ['Admin', 'User', 'Accountant', 'Client', 'BossAccountant'];
  const [showModal, setShowModal] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State for alert visibility
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  /** Account settings the user can change. */
  const schema = new SimpleSchema({
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    email: { type: String, optional: true },
    roleType: { type: String, optional: true, allowedValues: roleTypes },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  const { userID, subReady, collectionName, userDocument } = useTracker(() => {
    let sub; /** Subscription to UserProfiles or AdminProfiles. */
    let subRdy; /** Is the subscription ready? */
    let colName; /** Collection name. */
    let userDoc; /** Entire user document. */
    let usrId; /** The user's ID. */
    let theRole; /** Is the profile being edited an admin or user? */

    /**
     * Try to find the user's document ID in the UserProfiles collection first.
     * Try AdminProfiles collection if user's document ID doesn't exist in UserProfiles collection.
     */
    try {
      userDoc = UserProfiles.findDoc(_docId);
      sub = UserProfiles.subscribeUserProfilesAdmin();
      theRole = 'user';
    } catch (error) {
      try {
        userDoc = ClientProfiles.findDoc(_docId);
        sub = ClientProfiles.subscribeClientProfilesAdmin();
        theRole = 'client';
      } catch (error2) {
        try {
          userDoc = AccountantProfiles.findDoc(_docId);
          sub = AccountantProfiles.subscribeAccountantProfilesAdmin();
          theRole = 'accountant';
        } catch (error3) {
          try {
            userDoc = BossAccountantProfiles.findDoc(_docId);
            sub = BossAccountantProfiles.subscribeBossAccountantProfilesAdmin();
            theRole = 'bossAccountant';
          } catch (error4) {
            userDoc = AdminProfiles.findDoc(_docId);
            sub = AdminProfiles.subscribeAdmin();
            theRole = 'admin';
          }
        }
      }
    }

    /** Check if user is an admin or a user, then assign relevant info. */
    if (theRole === 'admin') {
      subRdy = sub.ready();
      colName = AdminProfiles.getCollectionName();
      usrId = userDoc.userID;
    } else if (theRole === 'user') {
      subRdy = sub.ready();
      colName = UserProfiles.getCollectionName();
      usrId = userDoc.userID;
    } else if (theRole === 'accountant') {
      subRdy = sub.ready();
      colName = AccountantProfiles.getCollectionName();
      usrId = userDoc.userID;
    } else if (theRole === 'client') {
      subRdy = sub.ready();
      colName = ClientProfiles.getCollectionName();
      usrId = userDoc.userID;
    } else if (theRole === 'bossAccountant') {
      subRdy = sub.ready();
      colName = BossAccountantProfiles.getCollectionName();
      usrId = userDoc.userID;
    } else {
      navigate('/notauthorized');
    }

    return {
      userID: usrId,
      subReady: subRdy,
      collectionName: colName,
      userDocument: userDoc,
    };
  }, []);

  const submit = (data) => {
    /** Verify the user is actually logged in before doing anything. */
    if (!Meteor.user()) {
      swal('Error', 'You are not logged in.', 'error');
      return;
    }

    /** Stores the values the user inputs. */
    const { firstName, lastName, email, roleType } = data;

    /**
     * Add the documentID to the data being passed to the collection update function,
     * then call the collection update function.
     */
    const updateData = { id: _docId, userID, firstName, lastName, email, role: roleType };
    updateMethod.callPromise({ collectionName: collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    navigate('/profiles');
  };

  // checks to see if the user has typed the input correctly
  const handleInputChange = (e) => {
    const input = e.target.value;
    setTypedConfirmation(input);
    setDeleteEnabled(input === 'DELETE'); // Update as per your requirement
  };

  // Delete the current users account and redirects them after
  const handleDeleteAccount = () => {
    removeItMethod.callPromise({ collectionName, instance: _docId })
      .then(() => {
        setShowAlert(true); // Show alert
        setTimeout(() => {
          setShowAlert(false); // Hide alert after 3 seconds
          navigate('/profiles'); // Navigate to home
        }, 1000);
      })
      .finally(() => {
        handleCloseModal();
      });
  };

  return subReady ? (
    <Container id={PAGE_IDS.EDIT_USER_PROFILE} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit User Account Information</h2>
          </Col>
          <AutoForm model={userDocument} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_FIRST_NAME} name="firstName" placeholder="First Name" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_LAST_NAME} name="lastName" placeholder="Last Name" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_EMAIL} name="email" placeholder="email" />
                <Row>
                  <SelectField
                    id={COMPONENT_IDS.ACCOUNT_SETTINGS_ROLE}
                    name="roleType"
                  >
                    {roleTypes.map((aRoleType, key) => (
                      <option value={aRoleType} key={key}>{aRoleType}</option>))}
                  </SelectField>
                </Row>
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SAVE_ACCOUNT_CHANGES} value="Save Changes" />
                <Row>
                  &nbsp;
                </Row>
                {showAlert && (
                  <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
                    The account has been successfully deleted!
                  </Alert>
                )}
                <Button
                  id="modal-pop-up-button"
                  onClick={handleOpenModal}
                  className="btn"
                  style={{ width: '100%' }}
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
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};
export default EditProfile;
