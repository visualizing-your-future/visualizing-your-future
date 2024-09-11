// Home page for a logged-in user (see issue-21)
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const Home = () => (
  <Container id={PAGE_IDS.HOME} className="py-3">
    <Row className="align-middle text-center">
      <h2>My Futures</h2>
      <p style={{ color: 'gray' }}>View your clients&apos; profiles and projections</p>
      <Col className="align-middle">
        <hr/>
      </Col>
      <br/>
      <br/>
      <h1>Hi, <b>{Meteor.user()?.username}</b>!</h1>
      <Col xs={3}>
        <h3>Client Profiles</h3>
      </Col>
      <Col xs={6} className="d-flex flex-column justify-content-center">
        <div>See details per client here.</div>
      </Col>
      <Col xs={3} className="d-flex flex-column justify-content-center">
        <Button><h5>View Client's Projection</h5></Button>
      </Col>
    </Row>
  </Container>
);

export default Home;