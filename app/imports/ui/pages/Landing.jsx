import React from 'react';
import { Col, Container, Button, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const Landing = () => (
  <div>
    <div id="landing-page-container">
      {/* Main Container */}
      <Container id={PAGE_IDS.LANDING}>
        {/* First Row: Main content */}
        <Row className="d-flex flex-column justify-content-center align-items-center text-center h-100">
          <Col xs={12}>
            <h1 className="mt-4">Welcome to Spire</h1>
            <p className="lead">Discover. Innovate. Grow.</p>
            <Button variant="primary" size="lg" className="button-square mt-3" id="button-square" href="/signin">
              Learn More
            </Button>
          </Col>
        </Row>
      </Container>
    </div>

    {/* Second Section: Why Spire */}
    <Container fluid className="why-spire-section">
      <Row className="justify-content-center text-center">
        <Col xs={12} md={8} lg={6}>
          <h2>Why Spire?</h2>
          <p>
            At Spire, we believe in innovation and growth. Join us to explore opportunities and discover new possibilities in your career.
          </p>
        </Col>
      </Row>

      {/* Service Rows */}
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
  </div>
);

export default Landing;
