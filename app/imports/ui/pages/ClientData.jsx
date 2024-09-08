import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
import LoadingSpinner from '../components/LoadingSpinner';

const ClientData = () => {
  // State to manage the currently selected client
  const [selectedClient, setSelectedClient] = useState('');

  // State to calculate and store the total cash value
  const [totalCash, setTotalCash] = useState(0);

  // useTracker to fetch client data and manage subscription readiness
  const { dataStuff, ready } = useTracker(() => {
    // Subscribe to the audited balance data
    const subscription = AuditedBalanceData.subscribeABD();
    // Check if the subscription is ready
    const rdy = subscription.ready();
    // Fetch client data, sorted by client name
    const data = AuditedBalanceData.find({}, { sort: { name: 1 } }).fetch();
    return { dataStuff: data, ready: rdy };
  }, []);

  // useEffect to update total cash whenever data is ready or the selected client changes
  useEffect(() => {
    if (ready && selectedClient) {
      // Find the selected client's data
      // eslint-disable-next-line no-shadow
      const client = dataStuff.find(client => client.name === selectedClient);
      if (client?.cashStuff) {
        // Calculate the total cash from the client's cashStuff array
        const total = client.cashStuff.reduce(
          (sum, item) => sum + (item.pettyCash || 0) + (item.cash || 0) + (item.cashBankCred || 0),
          0,
        );
        // Update the total cash state
        setTotalCash(total);
      }
    }
  }, [ready, selectedClient, dataStuff]);

  return (
    // Conditionally render the component based on whether the data is ready
    ready ? (
      <Container className="py-3">
        <Row className="justify-content-center pb-3">
          <Col md={7} className="text-center">
            <h2>Select a Client</h2>
            <Form.Select onChange={e => setSelectedClient(e.target.value)} aria-label="Select Client">
              <option value="">Choose a Client</option>
              {/* Render a list of clients as options in the dropdown */}
              {dataStuff.map(client => (
                <option key={client._id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        {/* Conditionally render the financial data card if a client is selected */}
        {selectedClient && (
          <Row className="pb-3">
            <Col md={7} className="text-center">
              <Card>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Card.Header>{selectedClient}'s Financial Data</Card.Header>
                <Card.Body>
                  {/* Conditionally render financial data if available */}
                  {dataStuff.find(client => client.name === selectedClient)?.cashStuff[0] && (
                    <>
                      <h5>Cash and Cash Equivalents</h5>
                      <p><strong>Petty Cash:</strong> {dataStuff.find(client => client.name === selectedClient).cashStuff[0].pettyCash}</p>
                      <p><strong>Cash:</strong> {dataStuff.find(client => client.name === selectedClient).cashStuff[0].cash}</p>
                      <p><strong>Cash in banks/Line of Credit:</strong> {dataStuff.find(client => client.name === selectedClient).cashStuff[0].cashBankCred}</p>
                      <hr />
                      <h6>Total Cash: {totalCash}</h6>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    ) : (
      <LoadingSpinner message="Loading Client Data" />
    )
  );
};

export default ClientData;
