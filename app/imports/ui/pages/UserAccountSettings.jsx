// import React, { useState } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { Stuffs } from '../../api/stuff/StuffCollection';
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
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  // State handler.
  // const [error, setError] = useState('');

  // Waits until subscribed to database and account information is returned.
  const { ready, user, upname } = useTracker(() => {
    const sub = UserProfiles.subscribe();
    const userProfilesCollectionName = UserProfiles.getCollectionName();
    // const sub = Meteor.subscribe(UserProfiles.getCollectionName());
    // const currentUser = Meteor.user().username;
    const document = UserProfiles.findOne({ email: Meteor.user()?.username });
    return {
      upname: userProfilesCollectionName,
      ready: sub.ready(),
      user: document,
    };
  }, []);

  /* Submit changes to first and last names. */
  const submit = (data) => {
    const { firstName, lastName } = data;
    UserProfiles.update(user, { firstName, lastName });
    navigate('/home');
  };

  /* Stateful page */
  return (
    console.log(upname),
    console.log(ready),
      console.log('break'),
    //console.log(user.firstName),
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
  );
};

export default UserAccountSettings;
