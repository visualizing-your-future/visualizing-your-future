// Home page for a logged-in user (see issue-21)
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container id={PAGE_IDS.HOME} className="py-3">
      <Row className="text-center">
        <h2>My Futures</h2>
        <p style={{ color: 'gray' }}>View your clients&apos; profiles and projections</p>
        <Col className="text-center">
          <hr />
        </Col>
        <br />
        <br />
        <h1>Hi, <b>{Meteor.user()?.username}</b>!</h1>
        <Col xs={3}>
          <h3>Client Profiles</h3>
        </Col>
        <Col xs={6} className="d-flex flex-column justify-content-center">
          <div>See details per client here.</div>
          <Row className="d-flex justify-content-center">
            <Col xs={4}>
              <Button onClick={() => handleNavigation('/clientDataImport')} className="btn btn-secondary">
                Import Data
              </Button>
            </Col>
            <Col xs={4}>
              <Button onClick={() => handleNavigation('/dataInput')} className="btn btn-secondary">
                View Financials
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={3} className="d-flex justify-content-center">
          <Button onClick={() => handleNavigation('/home')} className="btn btn-primary">
            <h5>See Client&apos;s Projections</h5>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
