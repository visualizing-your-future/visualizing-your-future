// Home page for a logged-in user (see issue-21)
import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import Meteor from 'meteor';
import { PAGE_IDS } from '../utilities/PageIDs';

const Home = () => {
  <Container id={PAGE_IDS.HOME} className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image roundedCircle src="/images/meteor-logo.png" width="150px" />
      </Col>

      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1>Visualizing Your Future</h1>
        <p>Welcome, <b>{Meteor.user()?.username}</b>!</p>
      </Col>

    </Row>
  </Container>;
};

export default Home;
