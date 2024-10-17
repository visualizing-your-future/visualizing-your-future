import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/* Renders the EditProfile page for editing a single document. */
const EditProfile = () => {
  document.title = 'Edit User Profile';
  const _docId = useParams();
  const navigate = useNavigate();
  const roleTypes = ['Admin', 'User'];

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
    let adminRole; /** Is the profile being edited an admin or user? */

    /**
     * Try to find the user's document ID in the UserProfiles collection first.
     * Try AdminProfiles collection if user's document ID doesn't exist in UserProfiles collection.
     */
    try {
      userDoc = UserProfiles.findDoc(_docId);
      sub = UserProfiles.subscribeProfileAdmin();
      adminRole = false;
    } catch (error) {
      userDoc = AdminProfiles.findDoc(_docId);
      sub = AdminProfiles.subscribeAdmin();
      adminRole = true;
    }

    /** Check if user is an admin or a user, then assign relevant info. */
    if (adminRole) {
      subRdy = sub.ready();
      colName = AdminProfiles.getCollectionName();
      usrId = userDoc.userID;
    } else if (!adminRole) {
      subRdy = sub.ready();
      colName = UserProfiles.getCollectionName();
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
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_LAST_NAME} name="lastName" placeholder="Last name" />
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
                <Button
                  id={COMPONENT_IDS.DELETE_USER_ACCOUNT}
                  onClick={() => {
                    removeItMethod.callPromise({ collectionName: collectionName, instance: _docId });
                    navigate('/profiles');
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
  ) : <LoadingSpinner />;
};
export default EditProfile;
