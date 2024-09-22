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

/**
 * Landing component:
 * This component renders the landing page, displaying different dashboards based on the user type:
 * Admins, regular users, and guests. It uses Meteor's useTracker hook to subscribe to
 * the necessary user profile data.
 */
const Landing = () => {
  const navigate = useNavigate();

  /**
   * handleNavigation:
   * Helper function to navigate to a different page when the user clicks a button.
   */
  const handleNavigation = (path) => {
    navigate(path);
  };

  /**
   * useTracker:
   * This hook subscribes to the user and admin profiles and fetches the firstName, lastName,
   * and user type (admin or regular user). It also manages a loading state while waiting for the subscription data.
   */
  const { currentUser, firstName, lastName, isAdmin, isLoading } = useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();

    // Loading state - true until subscriptions are ready
    let isLoading = true;

    // Check if the user is an Admin
    const isAdmin = Roles.userIsInRole(userId, [ROLE.ADMIN]);

    let firstName = '';
    let lastName = '';
    let profile;

    // If the user is an admin, subscribe to AdminProfiles and fetch admin-specific data
    if (isAdmin) {
      const adminHandle = AdminProfiles.subscribeAdmin();
      if (!adminHandle.ready()) {
        return { isLoading: true }; // Early return if not ready
      }

      profile = AdminProfiles.findOne({ email: user?.username });
    } else {
      // Otherwise, subscribe to UserProfiles and fetch user-specific data
      const userHandle = UserProfiles.subscribeProfileUser();
      if (!userHandle.ready()) {
        return { isLoading: true }; // Early return if not ready
      }

      profile = UserProfiles.findOne({ email: user?.username });
    }

    // Set firstName and lastName based on profile data
    if (profile) {
      firstName = profile.firstName || '';
      lastName = profile.lastName || '';
    }

    isLoading = false; // Set loading to false once data is ready

    return {
      currentUser: user ? user.username : '',
      firstName,
      lastName,
      isAdmin,
      isLoading,
    };
  }, []);

  // Display a loading spinner while subscriptions are still loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  /**
   * getWelcomeMessage:
   * Helper function to return the appropriate welcome message based on whether the user is an Admin, a regular user, or a guest.
   */
  const getWelcomeMessage = () => {
    if (isAdmin) {
      return <h1 className="mt-4">Welcome {firstName || currentUser} {lastName}!</h1>;
    } else if (currentUser) {
      return <h1 className="mt-4">Welcome {firstName || currentUser} {lastName}!</h1>;
    } else {
      return <h1 className="mt-4">Welcome to Spire</h1>;
    }
  };

  /**
   * renderButtonsForAdmin:
   * Helper function that returns buttons for actions available to admin users, such as importing client data and inputting data.
   */
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

  /**
   * renderButtonsForUser:
   * Helper function that returns buttons for actions available to regular users, such as importing client data and seeing projections.
   */
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

  /**
   * Main return block:
   * This renders the landing page, showing different views for admins, users, and guests.
   * It uses helper functions to display the correct content for each role.
   */
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
