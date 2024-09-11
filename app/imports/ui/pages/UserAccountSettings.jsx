import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const UserAccountSettings = () => {
  // Names the page in the browser.
  document.title = 'Visualizing Your Future - Account Settings';

  // Used to change page after submitting account changes.
  const navigate = useNavigate();

  // Account settings the user can change.
  const schema = new SimpleSchema({
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    email: { type: String, optional: true },
    password: { type: String, optional: true },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  // State handler.
  // const [error, setError] = useState('');

  // Waits until subscribed to database and account information is returned.
  const { cUser, upname, apname, userSubReady, adminSubReady, userDocument, adminDocument } = useTracker(() => {
    // TODO: put sub in if statement based on user role.
    const userSub = UserProfiles.subscribeProfileAdmin();
    const adminSub = AdminProfiles.subscribeAdmin();

    // Determine if subscriptions are ready
    const userSubRdy = userSub.ready();
    const adminSubRdy = adminSub.ready();

    // Get the profile collection names.
    const userProfilesCollectionName = UserProfiles.getCollectionName();
    const adminProfilesCollectionName = AdminProfiles.getCollectionName();

    // Get the current user's username (should be email).
    const currentUser = Meteor.user().username;
    const userDoc = UserProfiles.findOne({ email: currentUser });
    const adminDoc = AdminProfiles.findOne({ email: currentUser });

    // One liner for the above code.
    // const document = UserProfiles.findOne({ email: Meteor.user()?.username });

    return {
      cUser: currentUser,
      upname: userProfilesCollectionName,
      apname: adminProfilesCollectionName,
      userSubReady: userSubRdy,
      adminSubReady: adminSubRdy,
      userDocument: userDoc,
      adminDocument: adminDoc,
    };
  }, []);

  /* Submit changes to first and last names. */
  const submit = (data) => {
    const { firstName, lastName } = data;
    // AdminProfiles.update(adminDocument._id, { firstName, lastName });
    const adminProfilesCollectionName = AdminProfiles.getCollectionName();
    const _id = AdminProfiles.getID(Meteor.user().username);
    const updateData = { id: _id, firstName, lastName };
    updateMethod.callPromise({ collectionName: adminProfilesCollectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    navigate('/profiles');
  };

  /* Stateful page */
  return (userSubReady && adminSubReady) ? (
    <Container id={PAGE_IDS.SIGN_UP} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit User Account Information</h2>
          </Col>
          <AutoForm model={adminDocument} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.CHANGE_ACCOUNT_FIRST_NAME} name="firstName" placeholder="First Name" />
                <TextField id={COMPONENT_IDS.CHANGE_ACCOUNT_LAST_NAME} name="lastName" placeholder="Last name" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL} name="email" placeholder="email" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} name="password" placeholder="Password" type="password" />
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

export default UserAccountSettings;
