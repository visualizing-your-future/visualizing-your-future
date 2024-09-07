import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SubmitField, NumField } from 'uniforms-bootstrap5';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
// import { useParams } from 'react-router';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(AuditedBalanceData._schema);

const DataInput = () => {
  const [totalCash, setTotalCash] = useState(0);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { dataStuff, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = AuditedBalanceData.subscribeABD();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const data = AuditedBalanceData.find({}, { sort: { name: 1 } }).fetch();
    return {
      dataStuff: data,
      ready: rdy,
    };
  }, []);

  useEffect(() => {
    if (ready && dataStuff.length > 0 && dataStuff[0].cashStuff) {
      const cashArray = dataStuff[0].cashStuff;
      const total = cashArray.reduce((sum, item) => sum + (item.pettyCash || 0) + (item.cash || 0) + (item.cashBankCred || 0), 0);
      setTotalCash(total);
    }
  }, [ready, dataStuff]);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { cashStuff } = data;
    const docID = dataStuff[0]._id;
    const collectionName = AuditedBalanceData.getCollectionName();
    const updateData = { id: docID, cashStuff };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  return (ready ? (
    <Container id={PAGE_IDS.DATA_STUFF} className="py-3">
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
            <Col className="col-lg-2">Year 1</Col>
          </Row>
        </Col>
        <hr className="solid" />
      </Row>
      <Row className="justify-content-start pb-3">
        <Col className="col-lg-3">
          <h5>Cash and Cash Equivalents</h5>
          <Row className="px-3">
            <h6 className="py-3">Petty Cash</h6>
            <h6 className="py-3">Cash</h6>
            <h6 className="py-3">Cash in banks/Draw on Line of Credit</h6>
            <hr className="solid mb-0" />
            <h6 className="text-end">Total Cash and Cash Equivalents</h6>
          </Row>
        </Col>
        <Col className="col-lg-2">
          <Row className="pt-5">
            <AutoForm schema={bridge} onSubmit={data => submit(data)} model={AuditedBalanceData.findOne(dataStuff._id)}>
              <Card.Body className="my-0">
                <NumField name="cashStuff.0.pettyCash" decimal label={null} />
                <NumField className="m-0" name="cashStuff.0.cash" decimal label={null} />
                <NumField className="m-0" name="cashStuff.0.cashBankCred" decimal label={null} />
                <h6>{totalCash}</h6>
                <SubmitField value="Update" className="pt-4" />
                <ErrorsField />
                <HiddenField name="owner" />
              </Card.Body>
            </AutoForm>
          </Row>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Data" />);
};

export default DataInput;
