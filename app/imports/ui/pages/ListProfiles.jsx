import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import ProfileItem from '../components/ProfileItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import AdminProfileItem from '../components/AdminProfileItem';

/* Renders a table containing all of the Users documents. Use <ProfileItem> to render each row. */
const ListProfiles = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { userProfileItems, adminProfileItems, userSubReady, adminSubReady } = useTracker(() => {
    // Get access to Users and Admins documents.
    const userSub = UserProfiles.subscribeProfileAdmin();
    const adminSub = AdminProfiles.subscribeAdmin();
    // Determine if subscriptions are ready
    const userSubRdy = userSub.ready();
    const adminSubRdy = adminSub.ready();
    // Get the Users documents
    const usrProfiles = UserProfiles.find({}).fetch();
    const admProfiles = AdminProfiles.find({}).fetch();
    return {
      userProfileItems: usrProfiles,
      adminProfileItems: admProfiles,
      userSubReady: userSubRdy,
      adminSubReady: adminSubRdy,
    };
  }, []);
  return ((userSubReady && adminSubReady) ? (
    <Container id={PAGE_IDS.LIST_PROFILES} className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center"><h2>List Profiles</h2></Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {userProfileItems.map((profile) => <ProfileItem key={profile._id} profile={profile} />)}
              {adminProfileItems.map((profile) => <AdminProfileItem key={profile._id} profile={profile} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListProfiles;
