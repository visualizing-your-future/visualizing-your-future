import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Stuffs } from '../../api/stuff/StuffCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import FileInput from '../components/FileInput';
/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ClientDataImport = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Stuffs.subscribeStuff();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const stuffItems = Stuffs.find({}, { sort: { name: 1 } }).fetch();
    return {
      stuffs: stuffItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Row className="justify-content-center">
      <Col lg={12}>
        <Col className="text-center">
          <h1>Client Data</h1>
        </Col>
        <FileInput />
      </Col>
    </Row>
  ) : <LoadingSpinner message="Loading Stuff" />);
};

export default ClientDataImport;
