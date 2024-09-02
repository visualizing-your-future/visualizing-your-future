import React from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const Landing = () => {
  const landingStyle = {
    backgroundImage: 'url(/images/LandingPageBackground.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100',
    color: 'black',
  };

  return (
    <Container id={PAGE_IDS.LANDING} style={landingStyle} fluid>
      <Row className="align-items-center text-center vh-100">
        <Col xs={12}>
          <h1 className="mt-4">Welcome to Spire</h1>
          <p className="lead">Discover. Innovate. Grow.</p>
          <Button variant="primary" size="lg" className="button-square mt-3" id="button-square">
            Learn More
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
