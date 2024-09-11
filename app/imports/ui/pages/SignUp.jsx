import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField, RadioField } from 'uniforms-bootstrap5';
/* import select from 'uniforms-bootstrap5/src/SelectField'; */
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

/**
 * SignUp component is similar to signin component, but we create a new user instead.w
 */
const SignUp = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const [formModel, setFormModel] = useState({});

  const schema = new SimpleSchema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    accountType: {
      type: String,
      allowedValues: ['Accountant', 'Client'],
      label: 'Account Type: ',
    },
    clientKey: {
      type: String,
      optional: true,
      custom() {
        if (this.field('accountType').value === 'Client' && !this.value) {
          return 'required';
        }
        return undefined;
      },
    },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const collectionName = UserProfiles.getCollectionName();
    const definitionData = doc;

    if (doc.accountType === 'Client' && !doc.clientKey) {
      setError('Client key is required for account type Client');
      return;
    }

    // create the new UserProfile
    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        // log the new user in.
        const { email, password } = doc;
        Meteor.loginWithPassword(email, password, (err) => {
          if (err) {
            setError(err.reason);
          } else {
            setError('');
            setRedirectToRef(true);
          }
        });
      })
      .catch((err) => setError(err.reason));
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Navigate to="/add" />;
  }
  return (
    <Container id={PAGE_IDS.SIGN_UP} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Create Your Account</h2>
          </Col>
          <AutoForm
            schema={bridge}
            onSubmit={data => submit(data)}
            onChangeModel={(model) => setFormModel(model)}
          >
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME} name="firstName" placeholder="First name" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME} name="lastName" placeholder="Last name" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL} name="email" placeholder="E-mail address" />

                <RadioField id={COMPONENT_IDS.SIGN_UP_FORM_ACCOUNT_TYPE_OPTION} name="accountType" />

                {formModel.accountType === 'Client' && (
                  <TextField
                    id={COMPONENT_IDS.SIGN_UP_FORM_CLIENT_KEY}
                    name="clientKey"
                    placeholder="ex: EKIJTODS"
                  />
                )}

                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} name="password" placeholder="Password" type="password" />
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} />
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert variant="secondary">
            Already have an account? Login <Link to="/signin">here</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
