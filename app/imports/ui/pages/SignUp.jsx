import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField, RadioField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { AccountantProfiles } from '../../api/user/AccountantProfileCollection';
import { ClientProfiles } from '../../api/user/ClientProfileCollection';

/**
 * SignUp component is similar to signin component, but we create a new user instead.w
 */
const SignUp = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);
  const [formModel, setFormModel] = useState({});

  const schema = new SimpleSchema({
    email: String,
    password: String,
    accountType: {
      type: String,
      allowedValues: ['Accountant', 'Client'],
      label: 'Account Type',
      defaultValue: 'Accountant',
    },
    firstName: {
      type: String,
      label: 'First Name',
      optional: true,
      custom() {
        // eslint-disable-next-line react/no-this-in-sfc
        const accountType = this.field('accountType').value;
        // eslint-disable-next-line react/no-this-in-sfc
        if (accountType === 'Accountant' && !this.value) {
          return 'required'; // Require for 'Accountant'
        }
        return undefined;
      },
    },
    lastName: {
      type: String,
      label: 'Last Name',
      optional: true,
      custom() {
        // eslint-disable-next-line react/no-this-in-sfc
        const accountType = this.field('accountType').value;
        // eslint-disable-next-line react/no-this-in-sfc
        if (accountType === 'Accountant' && !this.value) {
          return 'required'; // Require for 'Accountant'
        }
        return undefined;
      },
    },
    companyName: {
      type: String,
      label: 'Company Name',
      optional: true,
      custom() {
        // eslint-disable-next-line react/no-this-in-sfc
        const accountType = this.field('accountType').value;
        // eslint-disable-next-line react/no-this-in-sfc
        if (accountType === 'Client' && !this.value) {
          return 'required'; // Require for 'Accountant'
        }
        return undefined;
      },
    },
    clientKey: {
      type: String,
      label: 'Client Key',
      optional: true,
      custom() {
        // eslint-disable-next-line react/no-this-in-sfc
        const accountType = this.field('accountType').value;
        // eslint-disable-next-line react/no-this-in-sfc
        if (accountType === 'Client' && !this.value) {
          return 'required'; // Require for 'Accountant'
        }
        return undefined;
      },
    },
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (data) => {
    let collectionName;
    let firstName;
    let lastName;
    const email = data.email;
    const password = data.password;

    if (data.accountType === 'Accountant') {
      collectionName = AccountantProfiles.getCollectionName();
      firstName = data.firstName;
      lastName = data.lastName;
    } else if (data.accountType === 'Client') {
      collectionName = ClientProfiles.getCollectionName();
      firstName = data.companyName;
      lastName = data.clientKey;
    }

    const definitionData = { firstName, lastName, email, password };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(registrationError => swal('Error', registrationError.message, 'error'))
      .then(() => {
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
    return <Navigate to="/landing" />;
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
            className="register-label-color"
          >
            <Card>
              <Card.Body>
                <RadioField id={COMPONENT_IDS.SIGN_UP_FORM_ACCOUNT_TYPE} name="accountType" />
                {formModel.accountType === 'Accountant' && (
                  <>
                    <TextField id={COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME} name="firstName" placeholder="first name" />
                    <TextField id={COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME} name="lastName" placeholder="last name" />
                  </>
                )}
                {formModel.accountType === 'Client' && (
                  <>
                    <TextField id={COMPONENT_IDS.SIGN_UP_FORM_COMPANY_NAME} name="companyName" placeholder="company name" />
                    <TextField id={COMPONENT_IDS.SIGN_UP_FORM_CLIENT_KEY} name="clientKey" placeholder="client key" />
                  </>
                )}
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL} name="email" placeholder="email address" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} name="password" placeholder="password" type="password" />
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
