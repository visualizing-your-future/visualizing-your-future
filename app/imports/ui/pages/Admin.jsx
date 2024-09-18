import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row } from 'react-bootstrap';
import { Stuffs } from '../../api/stuff/StuffCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders a table containing all of the Stuff documents. Use <StuffItemAdmin> to render each row. */
const Admin = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Stuffs.subscribeStuffAdmin();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const items = Stuffs.find({}).fetch();
    return {
      stuffs: items,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container id={PAGE_IDS.ADMIN} className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center"><h1>Page in-working progress</h1></Col>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default Admin;
