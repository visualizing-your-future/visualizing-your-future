import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row } from 'react-bootstrap';
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
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { Users } from '../../api/user/UserCollection';
import { ROLE } from '../../api/role/Role';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const AccountSettings = () => {
  /** Names the page in the browser. */
  document.title = 'Visualizing Your Future - Account Settings';

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
    /** Was the subscription successful? */
    let sub;
    /** Is the subscription ready? */
    let subRdy;
    /** Collection name. */
    let colName;
    /** Entire user document. */
    let userDoc;
    /** The user's document ID. */
    let docID;
    /** The user's ID. */
    const usrId = Meteor.userId();
    /** The user's username. */
    const username = Meteor.user().username;

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

  const submit = (data) => {
    const { firstName, lastName, email, oldPassword, newPassword, verifyNewPassword } = data;

    /** Check if user input new password correctly. */
    if (oldPassword && (newPassword === verifyNewPassword)) {
      Users.updatePassword(oldPassword, newPassword);
    } else if (oldPassword && (newPassword !== verifyNewPassword)) {
      swal('Error', 'Passwords do not match.', 'error');
      return;
    }

    const updateData = { id: documentID, userID, firstName, lastName, email, oldPassword, newPassword };
    console.log('passwords match');
    console.log(collectionName, updateData);
    updateMethod.callPromise({ collectionName: collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    /**
     * TODO: implement logic to determine if password changed.
     * Currently, if the password is changed, the user is logged out, but redirected to the
     * userAccountSettings page with no access to anything.
     *
     * Should redirect to userAccountSettings page if password or email was NOT changed.
     * Redirect to signin page if password or email was changed.
     */
    navigate('/userAccountSettings');
  };

  return subReady ? (
    <Container id={PAGE_IDS.ACCOUNT_SETTINGS} className="py-3">
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
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_OLD_PASSWORD} name="newPassword" placeholder="New Password" type="password" />
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_OLD_PASSWORD} name="verifyNewPassword" placeholder="Re-type New Password" type="password" />
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

export default AccountSettings;
