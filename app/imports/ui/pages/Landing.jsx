import React from 'react';
import { Col, Container, Button, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { useNavigate } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Landing page component that renders a welcome message and different button actions
 * based on the user's role (Admin or User).
 */
const Landing = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation when a button is clicked.
   * @param {string} path - The path to navigate to.
   */
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Tracker to manage the current user's profile and role.
  const tracker = useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();
    let ready = false; // To track the loading state
    let isAdmin = false;
    let firstName = '';
    let lastName = '';
    let profile;

    if (!userId) {
      // If the user is not logged in, return default values.
      return { currentUser: '', isAdmin: false, firstName: '', lastName: '', ready: true };
    }

    // Check if the user has the Admin role
    isAdmin = Roles.userIsInRole(userId, [ROLE.ADMIN]);

    if (isAdmin) {
      const adminHandle = AdminProfiles.subscribeAdmin();
      if (!adminHandle.ready()) {
        return { ready: false };
      }
      profile = AdminProfiles.findOne({ email: user?.username });
    } else {
      const userHandle = UserProfiles.subscribeProfileUser();
      if (!userHandle.ready()) {
        return { ready: false };
      }
      profile = UserProfiles.findOne({ email: user?.username });
    }

    // Set the first and last name if available in the profile
    if (profile) {
      firstName = profile.firstName || '';
      lastName = profile.lastName || '';
    }

    ready = true; // Data is ready for rendering

    return {
      currentUser: user ? user.username : '',
      firstName,
      lastName,
      isAdmin,
      ready,
    };
  }, []);

  // Destructuring the data from the tracker
  const { currentUser, firstName, lastName, isAdmin, ready } = tracker;

  if (!ready) {
    return <LoadingSpinner />;
  }

  /**
   * Function to get the welcome message based on user role and profile.
   * If no user is logged in, it will return the default message.
   */
  const getWelcomeMessage = () => {
    if (isAdmin || currentUser) {
      // If the user is logged in, either admin or regular user, display the personalized welcome
      return (
        <h1 className="mt-4">
          Welcome {firstName || currentUser} {lastName}!
        </h1>
      );
    }
    // If no user is logged in, display the default welcome message
    return (
      <div>
        <h1 className="mt-4">Welcome to Spire</h1>
        <Button
          variant="primary"
          size="lg"
          className="button-square mt-3"
          id="button-square"
          href="/signin"
        >
          Learn More
        </Button>
      </div>
    );
  };

  /**
   * Generalized function to render buttons for navigation.
   * @param {Array} buttonDetails - Array of button objects with text and path for navigation.
   */
  const renderButtons = (buttonDetails) => (
    <Row className="d-flex justify-content-center mb-4 py-5">
      {buttonDetails.map((button, index) => (
        <Col key={index} xs={12} md={4} className="mb-2 d-flex justify-content-center">
          <Button onClick={() => handleNavigation(button.path)} className="btn btn-secondary" id="button-landing">
            {button.text}
          </Button>
        </Col>
      ))}
    </Row>
  );

  // Button configurations for admin and user
  const adminButtons = [
    { text: 'Import Client Data', path: '/clientDataImport' },
    { text: 'Data Input', path: '/dataInput' },
    { text: 'See Client\'s Projections', path: '/VisualizationExport' },
  ];

  const userButtons = [
    { text: 'Import Client Data', path: '/clientDataImport' },
    { text: 'Data Input', path: '/dataInput' },
    { text: 'See Client\'s Projections', path: '/VisualizationExport' },
  ];

  // Only render buttons for logged-in users (Admin or Regular users)
  const shouldRenderButtons = isAdmin || (currentUser && !isAdmin);

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

      {/* Render buttons only for logged-in users */}
      {shouldRenderButtons && (
        <Container fluid className="py-5">
          {isAdmin ? renderButtons(adminButtons) : renderButtons(userButtons)}
        </Container>
      )}

      {/* Additional content for users who are not logged in */}
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
