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
import { ROLE } from '../../api/role/Role';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const AccountSettings = () => {
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
  const { userID, subReady, collectionName, userDocument } = useTracker(() => {
    const username = Meteor.user().username;
    let sub;
    let subRdy;
    let colName;
    let userDoc;

    const usrId = Meteor.userId();
    if (Roles.userIsInRole(usrId, ROLE.ADMIN)) {
      sub = AdminProfiles.subscribeAdmin();
      subRdy = sub.ready();
      colName = AdminProfiles.getCollectionName();
      userDoc = AdminProfiles.findOne({ email: username });
    } else if (Roles.userIsInRole(usrId, ROLE.USER)) {
      sub = UserProfiles.subscribeProfileUser();
      subRdy = sub.ready();
      colName = UserProfiles.getCollectionName();
      userDoc = UserProfiles.findOne({ email: username });
    } else {
      navigate('/notauthorized');
    }
    console.log(userDoc);
    return {
      userID: usrId,
      subReady: subRdy,
      collectionName: colName,
      userDocument: userDoc,
    };
  }, []);

  /* Submit changes to first and last names. */
  const submit = (data) => {
    const { firstName, lastName, email, password } = data;
    /**
     * Meteor.userID() returns the userID.
     * This returns the document ID (_id). */
    const _id = AdminProfiles.getID(Meteor.user().username);
    const updateData = { id: _id, userID, firstName, lastName, email, password };
    updateMethod.callPromise({ collectionName: collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    navigate('/userAccountSettings');
  };

  /* Stateful page */
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
                <TextField id={COMPONENT_IDS.ACCOUNT_SETTINGS_PASSWORD} name="password" placeholder="Password" type="password" />
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
