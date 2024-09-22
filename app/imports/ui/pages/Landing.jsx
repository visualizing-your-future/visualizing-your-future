import React from 'react';
import { Col, Container, Button, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { useNavigate } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection'; // Import AdminProfiles
import LoadingSpinner from '../components/LoadingSpinner'; // Import a loading spinner

const Landing = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // useTracker connects Meteor data to React components
  const { currentUser, firstName, lastName, isAdmin, isLoading } = useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();

    // Loading state
    let isLoading = true;

    // Check if the user is an Admin
    const isAdmin = Roles.userIsInRole(userId, [ROLE.ADMIN]);

    let firstName = '';
    let lastName = '';
    let profile;

    if (isAdmin) {
      // Subscribe to Admin Profile
      const adminHandle = AdminProfiles.subscribeAdmin();
      if (!adminHandle.ready()) {
        return { isLoading: true }; // Early return if not ready
      }

      // Fetch Admin Profile
      profile = AdminProfiles.findOne({ email: user?.username });
    } else {
      // Subscribe to User Profile
      const userHandle = UserProfiles.subscribeProfileUser();
      if (!userHandle.ready()) {
        return { isLoading: true }; // Early return if not ready
      }

      // Fetch User Profile
      profile = UserProfiles.findOne({ email: user?.username });
    }

    // Set firstName and lastName based on profile data
    if (profile) {
      firstName = profile.firstName || '';
      lastName = profile.lastName || '';
    }

    isLoading = false;

    return {
      currentUser: user ? user.username : '',
      firstName,
      lastName,
      isAdmin,
      isLoading,
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getWelcomeMessage = () => {
    if (isAdmin) {
      return <h1 className="mt-4">Welcome Admin {firstName || currentUser} {lastName}!</h1>;
    } else if (currentUser) {
      return <h1 className="mt-4">Welcome User {firstName || currentUser} {lastName}!</h1>;
    } else {
      return <h1 className="mt-4">Welcome to Spire</h1>;
    }
  };

  const renderButtonsForAdmin = () => (
    <Container fluid className="py-5">
      <Container id={PAGE_IDS.HOME} className="py-5">
        <Row className="text-center">
          <h3>Client Profiles</h3>
          <div>See details per client here.</div>
        </Row>
        <Row className="d-flex justify-content-center mb-4 py-5">
          <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
            <Button onClick={() => handleNavigation('/clientDataImport')} className="btn btn-secondary" id="button-square">
              Import Client Data
            </Button>
          </Col>
          <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
            <Button onClick={() => handleNavigation('/dataInput')} className="btn btn-secondary" id="button-square">
              Data Input
            </Button>
          </Col>
          <Col xs={12} md={4} className="d-flex justify-content-center">
            <Button onClick={() => handleNavigation('/VisualizationExport')} className="btn btn-secondary" id="button-square">
              See Client&apos;s Projections
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );

  const renderButtonsForUser = () => (
    <Container fluid id={PAGE_IDS.HOME} className="py-5">
      <Row className="justify-content-center text-center">
        <Col xs={12} md={8}>
          <h3 className="mb-4">User Dashboard</h3>
          <p>Create your profile, connect with others, and explore opportunities to grow your career.</p>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center mb-4 py-5">
        <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
          <Button onClick={() => handleNavigation('/clientDataImport')} className="btn btn-secondary" id="button-square">
            Import Client Data
          </Button>
        </Col>
        <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
          <Button onClick={() => handleNavigation('/dataInput')} className="btn btn-secondary" id="button-square">
            Data Input
          </Button>
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-center">
          <Button onClick={() => handleNavigation('/VisualizationExport')} className="btn btn-secondary" id="button-square">
            See Client&apos;s Projections
          </Button>
        </Col>
      </Row>
    </Container>
  );

  return (
    <div>
      <div id="landing-page-container" className="py-5 text-center">
        <Container id={PAGE_IDS.LANDING}>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12}>
              {getWelcomeMessage()}
              {isAdmin && <p className="lead mt-3">Admin Dashboard</p>}
              {!isAdmin && currentUser && <p className="lead mt-3">User Dashboard</p>}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Admin-Specific Section */}
      {isAdmin && renderButtonsForAdmin()}

      {/* User-Specific Section */}
      {currentUser && !isAdmin && renderButtonsForUser()}

      {/* Guest Section */}
      {!currentUser && (
        <Container fluid className="py-5">
          <Row className="justify-content-center text-center">
            <Col xs={12} md={8}>
              <h2>Why Spire?</h2>
              <p className="mt-3">At Spire, we believe in innovation and growth. Join us to explore opportunities and discover new possibilities in your career.</p>
            </Col>
          </Row>
          <Row className="justify-content-center service-section mt-4">
            <Col xs={12} md={6} className="service-column">
              <h3>State Financial Agencies</h3>
              <h4>Services provided:</h4>
              <ul>
                <li>Design of accounting system framework, chart of accounts</li>
                <li>Statewide financial framework</li>
                <li>Organizational development and direction</li>
                <li>Project management</li>
                <li>Change management</li>
              </ul>
            </Col>
            <Col xs={12} md={6} className="service-column">
              <h3>An Agribusiness</h3>
              <h4>Services provided:</h4>
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
