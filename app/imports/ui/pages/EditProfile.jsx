import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Users } from '../../api/user/UserCollection';

/* Renders the EditProfile page for editing a single document. */
const EditProfile = () => {
  /** Names the page in the browser. */
  document.title = 'Edit User Profile';

  const { _id } = useParams();

  /** Used to change page after submitting account changes. */
  const navigate = useNavigate();

  /** Account settings the user can change. */
  const schema = new SimpleSchema({
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    email: { type: String, optional: true },
    oldPassword: { type: String, optional: true },
    newPassword: { type: String, optional: true },
    verifyNewPassword: { type: String, optional: true },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /**
   * Don't know what this is, might not be needed?
   *
   * State handler.
   * const [error, setError] = useState('');
   */

  const { userID, subReady, collectionName, userDocument, documentID } = useTracker(() => {
    /** The user's document ID. */
    const docID = UserProfiles.findDoc(_id);
    /** The user's ID. */
    const usrId = docID.userID;
    /** The user's username. */
    const username = docID.email;
    /** Was the subscription successful? */
    const sub = UserProfiles.subscribeProfileAdmin();
    /** Is the subscription ready? */
    const subRdy = sub.ready();
    /** Collection name. */
    const colName = UserProfiles.getCollectionName();
    /** Entire user document. */
    const userDoc = UserProfiles.findOne({ email: username });

    return {
      userID: usrId,
      subReady: subRdy,
      collectionName: colName,
      userDocument: userDoc,
      documentID: docID,
    };
  }, []);

  const submit = (data) => {
    /** Verify the user is actually logged in before doing anything. */
    if (!Meteor.user()) {
      swal('Error', 'You are not logged in.', 'error');
      return;
    }

    /** Stores the values the user inputs in the page TextFields. */
    const { firstName, lastName, email, oldPassword, newPassword, verifyNewPassword } = data;

    /**
     * Check if user intended to change password and input new password correctly.
     * If so, call CLIENT side function updatePassword().
     * If not, throw error.
     */
    if (oldPassword && (newPassword === verifyNewPassword)) {
      Users.updatePassword(oldPassword, newPassword);
    } else if (oldPassword && (newPassword !== verifyNewPassword)) {
      swal('Error', 'Passwords do not match.', 'error');
      return;
    }

    /**
     * Add the documentID to the data being passed to the collection update function,
     * then call the collection update function.
     */
    const updateData = { id: documentID, userID, firstName, lastName, email };
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
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_OLD_PASSWORD} name="oldPassword" placeholder="Old Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_NEW_PASSWORD} name="newPassword" placeholder="New Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_VERIFY_NEW_PASSWORD} name="verifyNewPassword" placeholder="Re-type New Password" type="password" />
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SAVE_ACCOUNT_CHANGES} value="Save Changes" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};
export default EditProfile;
