import React from 'react';
import { Col, Container, Button, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const Admin = () => (
  <Container>
    <Row className="justify-content-center">
      <Col className="text-center">
        <h2>Admin Dashboard</h2>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <Col className="text-center">
        <h2>User Management</h2>
        <p>View all users and update account information.</p>
        <Button variant="primary" size="lg" className="button-square mt-3" id="button-square" href="/profiles">
          Manage Users
        </Button>
      </Col>
      <Col className="text-center">
        <h2>Database Management</h2>
        <p>View projects and recent uploads.</p>
        <Button variant="primary" size="lg" className="button-square mt-3" id="button-square" href="/manage-database">
          Manage Databases
        </Button>
      </Col>
    </Row>
  </Container>
);

export default Admin;
