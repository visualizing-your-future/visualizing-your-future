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

const Landing = () => {
  const navigate = useNavigate();

  // Function to handle page navigation when a button is clicked
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Use Meteor's reactive data tracker to fetch user details and roles in real-time
  const tracker = useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();
    let isLoading = true; //
    let isAdmin = false;
    let firstName = '';
    let lastName = '';
    let profile;

    if (!userId) {
      // If the user is not logged in, set default values
      return { currentUser: '', isAdmin: false, firstName: '', lastName: '', isLoading: false };
    }

    // Check if the current user has the role of Admin
    isAdmin = Roles.userIsInRole(userId, [ROLE.ADMIN]);

    if (isAdmin) {
      // If the user is an admin, subscribe to the AdminProfiles collection
      const adminHandle = AdminProfiles.subscribeAdmin();
      if (!adminHandle.ready()) {
        return { isLoading: true };
      }
      // Retrieve the admin profile using the user's email
      profile = AdminProfiles.findOne({ email: user?.username });
    } else {
      // If the user is not an admin, subscribe to the UserProfiles collection
      const userHandle = UserProfiles.subscribeProfileUser();
      if (!userHandle.ready()) {
        return { isLoading: true };
      }
      profile = UserProfiles.findOne({ email: user?.username });
    }

    /**
     * If a profile is found, set the first and last name from the profile data
     * Default to empty string if firstName and lastName is not available
     */
    if (profile) {
      firstName = profile.firstName || '';
      lastName = profile.lastName || '';
    }

    isLoading = false; // Data has been loaded, stop showing the loading spinner

    /**
     * Return the required data for rendering the component
     * Set currentUser to username if user exists
     */
    return {
      currentUser: user ? user.username : '',
      firstName,
      lastName,
      isAdmin,
      isLoading,
    };
  }, []);

  // Destructuring the data returned from the tracker
  const { currentUser, firstName, lastName, isAdmin, isLoading } = tracker;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Function to generate the welcome message based on the user's role and name
  const getWelcomeMessage = () => {
    if (isAdmin) {
      return <h1 className="mt-4">Welcome {firstName || currentUser} {lastName}!</h1>;
    }
    if (currentUser) {
      return <h1 className="mt-4">Welcome {firstName || currentUser} {lastName}!</h1>;
    }
    return <div><h1 className="mt-4">Welcome to Spire</h1> <Button variant="primary" size="lg" className="button-square mt-3" id="button-square" href="/signin">Learn More</Button></div>;
  };

  // Renders buttons for admin users
  const renderButtonsForAdmin = () => (
    <Container fluid className="py-5">
      <Container id={PAGE_IDS.LANDING} className="py-5">
        <Row className="text-center">
          <h3>Client Profiles</h3>
          <div>See details per client here.</div>
        </Row>
        <Row className="d-flex justify-content-center mb-4 py-5">
          <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
            {/* Button for admin to import client data */}
            <Button onClick={() => handleNavigation('/clientDataImport')} className="btn btn-secondary" id="button-square">
              Import Client Data
            </Button>
          </Col>
          <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
            {/* Button for admin to input data */}
            <Button onClick={() => handleNavigation('/dataInput')} className="btn btn-secondary" id="button-square">
              Data Input
            </Button>
          </Col>
          <Col xs={12} md={4} className="d-flex justify-content-center">
            {/* Button for admin to view client's projections */}
            <Button onClick={() => handleNavigation('/VisualizationExport')} className="btn btn-secondary" id="button-square">
              See Client&apos;s Projections
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );

  // Renders buttons for regular users
  const renderButtonsForUser = () => (
    <Container fluid id={PAGE_IDS.LANDING} className="py-5">
      <Row className="justify-content-center text-center">
        <Col xs={12} md={8}>
          <h3 className="mb-4">User Dashboard</h3>
          <p>Create your profile, connect with others, and explore opportunities to grow your career.</p>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center mb-4 py-5">
        <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
          {/* Button for user to import client data */}
          <Button onClick={() => handleNavigation('/clientDataImport')} className="btn btn-secondary" id="button-square">
            Import Client Data
          </Button>
        </Col>
        <Col xs={12} md={4} className="mb-2 d-flex justify-content-center">
          {/* Button for user to input data */}
          <Button onClick={() => handleNavigation('/dataInput')} className="btn btn-secondary" id="button-square">
            Data Input
          </Button>
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-center">
          {/* Button for user to see client's projections */}
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

      {isAdmin && renderButtonsForAdmin()}
      {currentUser && !isAdmin && renderButtonsForUser()}
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
