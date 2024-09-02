import React from 'react';
import { Col, Container, Button, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const Landing = () => (
  <div id="landing-page-container">
    <Container id={PAGE_IDS.LANDING}>
      <Row className="d-flex flex-column justify-content-center">
        <Col xs={12}>
          <h1 className="mt-4">Welcome to Spire</h1>
          <p className="lead">Discover. Innovate. Grow.</p>
          <Button variant="primary" size="lg" className="button-square mt-3" id="button-square">
            Learn More
          </Button>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Landing;
