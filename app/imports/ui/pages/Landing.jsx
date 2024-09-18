import React from 'react';
import { Col, Container, Button, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { useNavigate } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const Landing = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // useTracker connects Meteor data to React components
  const { currentUser, isAdmin, firstNames, lastName } = useTracker(() => {
    const user = Meteor.user();
    const userProfileSub = UserProfiles.subscribeProfileUser();
    const userProfileSubRdy = userProfileSub.ready();
    const userProfile = UserProfiles.find({}).fetch()[0];
    return {
      currentUser: user ? user.username : '',
      firstNames: userProfileSubRdy ? userProfile.firstName : '',
      lastName: user ? user.lastName : '',
      isAdmin: Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]), // Check if the user is an admin
    };
  }, []);

  return (
    <div>
      <div id="landing-page-container" className="py-5 text-center">
        <Container id={PAGE_IDS.LANDING}>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12}>
              {isAdmin ? (
                <div>
                  <h1 className="mt-4">Welcome Admin {currentUser}!</h1>
                  <h1>Hi, <b>{firstNames}</b>!</h1>
                  <p className="lead mt-3">Admin Dashboard</p>
                </div>
              ) : currentUser ? (
                <div>
                  <h1 className="mt-4">Welcome User {currentUser}!</h1>
                  <p className="lead mt-3">User Dashboard</p>
                  <h1>Hi, <b>{firstName}</b>!</h1>

                </div>
              ) : (
                <h1 className="mt-4">Welcome to Spire</h1>
              )}
              <Button
                variant="primary"
                size="lg"
                className="button-square mt-3"
                id="button-square"
                href={currentUser ? '/home' : '/signin'}
              >
                {currentUser ? 'Account Settings' : 'Learn More'}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Admin-Specific Section */}
      {isAdmin && (
        <Container fluid className="py-5">

          <Container id={PAGE_IDS.HOME} className="py-5">
            <Row className="text-center">
              <h3>Client Profiles</h3>
            </Row>
            <Row className="d-flex justify-content-center mb-4">
              {/* First Button */}
              <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
                <Button
                  onClick={() => handleNavigation('/clientDataImport')}
                  className="btn btn-secondary"
                  id="button-square"
                >
                  Import Data
                </Button>
              </Col>

              {/* Second Button */}
              <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
                <Button
                  onClick={() => handleNavigation('/dataInput')}
                  className="btn btn-secondary"
                  id="button-square"
                >
                  View Financials
                </Button>
              </Col>

              {/* Third Button */}
              <Col xs={12} md={4} className="d-flex justify-content-center">
                <Button
                  onClick={() => handleNavigation('/home')}
                  className="btn btn-secondary"
                  id="button-square"
                >
                  See Client&apos;s Projections
                </Button>
              </Col>
            </Row>
          </Container>
        </Container>
      )}

      {/* User-Specific Section */}
      {currentUser && !isAdmin && (
        <Container fluid className="py-5">
          <Row className="justify-content-center text-center">
            <Col xs={12} md={8}>
              <h3 className="mb-4">User Dashboard</h3>
              <p>Create your profile, connect with others, and explore opportunities to grow your career.</p>
            </Col>
          </Row>
          <Container id={PAGE_IDS.HOME} className="py-5">
            <Row className="text-center">
              <h3>Client Profiles</h3>
            </Row>
            <Row className="d-flex justify-content-center mb-4">
              {/* First Button */}
              <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
                <Button
                  onClick={() => handleNavigation('/clientDataImport')}
                  className="btn btn-secondary"
                  id="button-square"
                >
                  Import Data
                </Button>
              </Col>

              {/* Second Button */}
              <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
                <Button
                  onClick={() => handleNavigation('/dataInput')}
                  className="btn btn-secondary"
                  id="button-square"
                >
                  View Financials
                </Button>
              </Col>

              {/* Third Button */}
              <Col xs={12} md={4} className="d-flex justify-content-center">
                <Button
                  onClick={() => handleNavigation('/home')}
                  className="btn btn-secondary"
                  id="button-square"
                >
                  See Client&apos;s Projections
                </Button>
              </Col>
            </Row>
          </Container>
        </Container>
      )}

      {/* Guest Section */}
      {!currentUser && (
        <Container fluid className="py-5">
          <Row className="justify-content-center text-center">
            <Col xs={12} md={8}>
              <h2>Why Spire?</h2>
              <p className="mt-3">At Spire, we believe in innovation and growth. Join us to explore opportunities and discover new possibilities in your career.</p>
            </Col>
          </Row>

          <Row className="my-5 justify-content-center">
            <Col xs={12} md={6}>
              <h4>State Financial Agencies</h4>
              <ul>
                <li>Design of accounting system framework, chart of accounts</li>
                <li>Statewide financial framework</li>
                <li>Organizational development and direction</li>
                <li>Project management</li>
                <li>Change management</li>
              </ul>
            </Col>
            <Col xs={12} md={6}>
              <h4>An Agribusiness</h4>
              <ul>
                <li>Outsource CFO services</li>
                <li>Financial system setup and implementation</li>
                <li>Financial planning and analysis</li>
                <li>Due diligence assistance</li>
                <li>Accounting setup</li>
              </ul>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Landing;
