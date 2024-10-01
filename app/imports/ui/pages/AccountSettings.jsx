import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField, BoolField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Roles } from 'meteor/alanning:roles';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';

const AccountSettings = () => {
  document.title = 'Visualizing Your Future - Account Settings';

  const navigate = useNavigate();

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

  const { userID, subReady, collectionName, userDocument, documentID } = useTracker(() => {
    const usrId = Meteor.userId();
    const username = Meteor.user()?.username;

    let sub, subRdy, colName, userDoc, docID;

    if (Roles.userIsInRole(usrId, ROLE.ADMIN)) {
      sub = AdminProfiles.subscribeAdmin();
      subRdy = sub.ready();
      colName = AdminProfiles.getCollectionName();
      userDoc = AdminProfiles.findOne({ email: username });
      docID = AdminProfiles.getID(Meteor.user().username);
    } else if (Roles.userIsInRole(usrId, ROLE.USER)) {
      sub = UserProfiles.subscribeProfileUser();
      subRdy = sub.ready();
      colName = UserProfiles.getCollectionName();
      userDoc = UserProfiles.findOne({ email: username });
      docID = UserProfiles.getID(Meteor.user().username);
    } else {
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

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mfaStatus, setMfaStatus] = useState(false);

  useEffect(() => {
    if (userDocument?.isMFAEnabled !== undefined) {
      setMfaStatus(userDocument.isMFAEnabled);
    } else {
      const storedMFA = localStorage.getItem('isMFAEnabled') === 'true';
      setMfaStatus(storedMFA);
    }
  }, [userDocument]);

  const submit = (data) => {
    if (!Meteor.user()) {
      swal('Error', 'You are not logged in.', 'error');
      return;
    }

    const { firstName, lastName, email, oldPassword, newPassword, verifyNewPassword, isMFAEnabled } = data;

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

    const updateData = { id: documentID, userID, firstName, lastName, email, isMFAEnabled };
    updateMethod.callPromise({ collectionName: collectionName, updateData })
      .then(() => {
        setMfaStatus(isMFAEnabled);
        swal('Success', `Account settings updated. MFA is now ${isMFAEnabled ? 'enabled' : 'disabled'}.`, 'success');
        setSaveSuccess(true);
      })
      .catch(error => swal('Error', error.message, 'error'));

    localStorage.setItem('isMFAEnabled', isMFAEnabled);
  };

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
          <AutoForm model={{ ...userDocument, isMFAEnabled: mfaStatus }} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_FIRST_NAME} name="firstName" placeholder="First Name" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_LAST_NAME} name="lastName" placeholder="Last name" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_EMAIL} name="email" placeholder="Email" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_OLD_PASSWORD} name="oldPassword" placeholder="Old Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_NEW_PASSWORD} name="newPassword" placeholder="New Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_VERIFY_NEW_PASSWORD} name="verifyNewPassword" placeholder="Re-type New Password" type="password" />
                <BoolField id={COMPONENT_IDS.ACCOUNT_SETTINGS_MFA} name="isMFAEnabled" label="Enable Multi-Factor Authentication" />
                <Alert variant="info">
                  Multi-Factor Authentication is currently <strong>{mfaStatus ? 'enabled' : 'disabled'}</strong>.
                </Alert>
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SAVE_ACCOUNT_CHANGES} value="Save Changes" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountSettings;
