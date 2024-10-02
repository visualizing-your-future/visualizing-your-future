import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Signin page overrides the form’s submit event and calls Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed.
 */
const SignIn = () => {
  const [error, setError] = useState(''); // For storing login error messages
  const [redirect, setRedirect] = useState(false); // For redirecting after successful passcode
  const [showPasscode, setShowPasscode] = useState(false); // To show/hide passcode input
  const [passcode, setPasscode] = useState(''); // To store the entered passcode
  const [passcodeError, setPasscodeError] = useState(''); // Handle incorrect passcode
  const [isMFAEnabled, setIsMFAEnabled] = useState(false); // MFA status

  // Set up the schema for the email and password fields
  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  // Fetch MFA status when the component mounts
  useEffect(() => {
    // Assume the MFA status is stored in localStorage (could also be fetched from a database)
    const storedMFA = localStorage.getItem('isMFAEnabled') === 'true';
    setIsMFAEnabled(storedMFA);
  }, []);

  // Handle initial signin submission using Meteor's account mechanism.
  const submit = (doc) => {
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        if (isMFAEnabled) {
          setShowPasscode(true); // Show the passcode field if MFA is enabled
        } else {
          setRedirect(true); // No MFA, redirect to landing page directly
        }
        setError(''); // Clear any previous errors
      }
    });
  };

  // Handle passcode submission
  const handlePasscodeSubmit = () => {
    if (passcode === '123') {
      setRedirect(true); // Correct passcode, redirect to landing page
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  // if correct authentication and passcode, redirect to the landing page
  if (redirect) {
    return (<Navigate to="/" />); // Redirecting to home page on successful passcode or login
  }

  return (
    <Container id={PAGE_IDS.SIGN_IN} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h1>Welcome!</h1>
            <h4>Please login to your account</h4>
          </Col>

          {!showPasscode ? (
            // Render the initial login form
            <AutoForm schema={bridge} onSubmit={data => submit(data)}>
              <Card>
                <Card.Body>
                  <TextField id={COMPONENT_IDS.SIGN_IN_FORM_EMAIL} name="email" placeholder="E-mail Address" />
                  <TextField id={COMPONENT_IDS.SIGN_IN_FORM_PASSWORD} name="password" placeholder="Password" type="password" />
                  <ErrorsField />
                  <SubmitField id={COMPONENT_IDS.SIGN_IN_FORM_SUBMIT} />
                </Card.Body>
              </Card>
            </AutoForm>
          ) : (
            // Render the passcode input form
            <Card>
              <Card.Body>
                <h4>Enter Passcode</h4>
                <input
                  type="text"
                  id="passcode"
                  name="passcode"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="form-control"
                />
                {passcodeError && <Alert variant="danger">{passcodeError}</Alert>}
                <button type="button" className="btn btn-primary" onClick={handlePasscodeSubmit}>
                  Submit Again
                </button>
              </Card.Body>
            </Card>
          )}

          <Alert variant="secondary">
            <h6>Don&#39;t have an account? Click <Link to="/signup">here</Link> to create one!</h6>
          </Alert>

          {error && (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
