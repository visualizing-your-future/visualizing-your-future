import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
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
import { Stuffs } from '../../api/stuff/StuffCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Users } from '../../api/user/UserCollection';
// import { defineMethod } from '../../api/base/BaseCollection.methods';

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
  const { ready, user, upname, cUser } = useTracker(() => {
    // TODO: put sub in if statement based on user role.
    const sub = UserProfiles.subscribeProfileAdmin();
    // const sub = UserProfiles.subscribeProfileUser()

    const userProfilesCollectionName = UserProfiles.getCollectionName();
    const currentUser = Meteor.user().username;
    const document = UserProfiles.findOne({ email: 'john@foo.com' });
    // const document = UserProfiles.findOne({ email: Meteor.user()?.username });
    return {
      cUser: currentUser,
      upname: userProfilesCollectionName,
      ready: sub.ready(),
      user: document,
    };
  }, []);

  /* Submit changes to first and last names. */
  const submit = (data) => {
    const { firstName, lastName } = data;
    UserProfiles.update(user, { firstName, lastName });
    const userProfilesCollectionName = UserProfiles.getCollectionName();
    const _id = Users.getID(Meteor.user().username);
    const updateData = { id: _id, firstName, lastName };
    updateMethod.callPromise({ userProfilesCollectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    navigate('/home');
  };

  /* Stateful page */
  return ready ? (
    console.log(cUser),
      console.log(upname),
      console.log(user),
    <Container id={PAGE_IDS.SIGN_UP} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Edit User Account Information</h2>
          </Col>
          <AutoForm model={user} schema={bridge} onSubmit={data => submit(data)}>
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
