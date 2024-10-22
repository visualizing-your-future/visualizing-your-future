import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const SignIn = () => {
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [enteredAnswer, setEnteredAnswer] = useState('');
  const [answerError, setAnswerError] = useState('');

  const schema = new SimpleSchema({
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  useEffect(() => {
    // Assume the MFA status is stored in localStorage (could also be fetched from a database)
    const storedMFA = localStorage.getItem('isMFAEnabled') === 'true';
    if (storedMFA) {
      const user = Meteor.user();
      if (user) {
        const userProfile = UserProfiles.findOne({ email: user.username });
        setSecurityQuestion(userProfile?.securityQuestion);
        setSecurityAnswer(userProfile?.securityAnswer);
      }
    }
  }, []);

  const submit = (doc) => {
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        const userProfile = UserProfiles.findOne({ email });
        setSecurityQuestion(userProfile?.securityQuestion);
        setSecurityAnswer(userProfile?.securityAnswer);
        setShowSecurityQuestion(true);
        setError('');
      }
    });
  };

  const handleSecurityQuestionSubmit = () => {
    if (enteredAnswer.toLowerCase() === securityAnswer.toLowerCase()) {
      setRedirect(true);
    } else {
      setAnswerError('Incorrect answer. Please try again.');
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Container id={PAGE_IDS.SIGN_IN} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h1>Welcome!</h1>
            <h4>Please login to your account</h4>
          </Col>

          {!showSecurityQuestion ? (
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
            <Card>
              <Card.Body>
                <h4>Security Question</h4>
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_SECURITY_QUESTION} name="security-answer" placeholder="Security" />
                <input
                  type="text"
                  id="security-answer"
                  name="security-answer"
                  placeholder="Enter your answer"
                  value={enteredAnswer}
                  onChange={(e) => setEnteredAnswer(e.target.value)}
                  className="form-control"
                />
                {answerError && <Alert variant="danger">{answerError}</Alert>}
                <button type="button" className="btn btn-primary mt-2" onClick={handleSecurityQuestionSubmit}>
                  Submit Answer
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
