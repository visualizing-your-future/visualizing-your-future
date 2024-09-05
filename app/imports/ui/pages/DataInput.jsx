import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { NumField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import { Stuffs } from '../../api/stuff/StuffCollection';
import StuffItem from '../components/StuffItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

const DataInput = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, stuffs } = useTracker(() => {
    const subscription = Stuffs.subscribeStuff();
    const rdy = subscription.ready();
    const stuffItems = Stuffs.find({}, { sort: { name: 1 } }).fetch();
    return {
      stuffs: stuffItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container id={PAGE_IDS.LIST_STUFF} className="py-3">
      <Row className="justify-content-center pb-3">
        <Col md={7}>
          <Col className="text-center">
            <h2>Audited Balance Sheet Temp</h2>
          </Col>
        </Col>
      </Row>
      <Row className="pb-1">
        <Col className="col-lg-3">
          <h6>Fiscal Year</h6>
        </Col>
        <Col className="col-lg-9">
          <Row className="justify-content-start">
            <Col>Year 1</Col>
            <Col>Year 2</Col>
            <Col>Year 3</Col>
            <Col>Year 4</Col>
          </Row>
        </Col>
        <hr className="solid" />
      </Row>
      <Row className="justify-content-start pb-3">
        <Col className="col-lg-3">
          <h5>Cash and Cash Equivalents</h5>
          <Row className="px-3">
            <h7>Petty Cash</h7>
            <h7>Cash</h7>
            <h7>Cash in banks/Draw on Line of Credit</h7>
            <hr className="solid mb-0" />
            <h6 className="text-end">Total Cash and Cash Equivalents</h6>
          </Row>
        </Col>
        <Col className="col-lg-9">
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Stuff" />);
};

export default DataInput;
