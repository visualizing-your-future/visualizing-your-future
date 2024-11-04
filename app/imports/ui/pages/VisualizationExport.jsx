import React, { useState, useEffect } from 'react'; // Added useEffect import
import { Col, Container, Row, Card, Table, Nav, Form, Button } from 'react-bootstrap';
import DualLineChart from '../components/DualLineChart';
import SingleLineChart from '../components/SingleLineChart';
import Comparison from '../components/Comparison';
import DoubleLineChart from '../components/DoubleLineChart';
import { SnapshotData } from '../../api/snapshot/SnapshotCollection';

// Currency formatter
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format;

// Main VisualizationExport component
const VisualizationExport = () => {
  const [snapshotData, setSnapshotData] = useState([]);
  const [activeKey, setActiveKey] = useState('snapshot');
  const [isDataVisible, setIsDataVisible] = useState({
    snapshot: false,
    '4year': false,
    '8year': false,
    '12year': false,
  });
  const [ready, setReady] = useState(false);

  // Use useEffect to fetch data from Meteor
  useEffect(() => {
    const subscription = Meteor.subscribe('snapshotData', {
      onReady: () => {
        setReady(true);
        const data = SnapshotData.find({}).fetch();
        setSnapshotData(data);
      },
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.stop();
    };
  }, []);

  // Hard-coded data for different year projections
  const dataSets = {
    snapshot: snapshotData,
    '4year': snapshotData.slice(0, 4), // Using first 4 years
    '8year': snapshotData.slice(0, 8), // Using first 8 years
    '12year': snapshotData, // All 12 years
  };

  const renderSnapshotTable = (data) => (
    <div className="table-container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Year</th>
            <th>Assets</th>
            <th>Liabilities</th>
            <th>Net Position</th>
            <th>Cash on Hand</th>
            <th>Debt</th>
            <th>Opex</th>
            <th>Liquidity</th>
            <th>Perpetuity</th>
            <th>Cash In Flow</th>
            <th>Cash Out Flow</th>
            <th>Net Cash Flow</th>
            <th>Budget</th>
            <th>Actual + Encumbrance</th>
            <th>Change of Actual + Encumbrance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.year}</td>
              <td>{currencyFormatter(entry.assets)}</td>
              <td>{currencyFormatter(entry.liabilities)}</td>
              <td>{currencyFormatter(entry.netPosition)}</td>
              <td>{currencyFormatter(entry.cashOnHand)}</td>
              <td>{currencyFormatter(entry.debt)}</td>
              <td>{currencyFormatter(entry.opex)}</td>
              <td>{currencyFormatter(entry.liquidity)}</td>
              <td>{currencyFormatter(entry.perpetuity)}</td>
              <td>{currencyFormatter(entry.cashInFlow)}</td>
              <td>{currencyFormatter(entry.cashOutFlow)}</td>
              <td>{currencyFormatter(entry.netCashFlow)}</td>
              <td>{currencyFormatter(entry.budget)}</td>
              <td>{currencyFormatter(entry.actualAndEncumbrance)}</td>
              <td>{currencyFormatter(entry.changeAE)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  const toggleDataVisibility = (key) => {
    setIsDataVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Container>
      <Row>
        <Col>
          <Nav variant="tabs" activeKey={activeKey} onSelect={setActiveKey} className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="snapshot" style={{ color: '#e64b37' }}>Snapshot</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="4year" style={{ color: '#e64b37' }}>4-Year Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="8year" style={{ color: '#e64b37' }}>8-Year Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="12year" style={{ color: '#e64b37' }}>12-Year Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="comparison" style={{ color: '#e64b37' }}>Compare Charts</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mt-3">
            <Card.Header style={{ backgroundColor: '#e64b37', color: 'white' }}>
              {activeKey.charAt(0).toUpperCase() + activeKey.slice(1)} View
            </Card.Header>
            <Card.Body>
              {ready ? (
                <>
                  {activeKey === 'snapshot' && (
                    <>
                      <Button onClick={() => toggleDataVisibility('snapshot')} variant="link">
                        {isDataVisible.snapshot ? 'Hide Data' : 'Show Data'}
                      </Button>
                      {isDataVisible.snapshot && renderSnapshotTable(dataSets.snapshot)}
                      <Row>
                        <Col>
                          <Card className="mt-3">
                            <Card.Body>
                              {activeKey && (
                                <>
                                  <h5>{activeKey.toUpperCase()} View</h5>
                                  <Row>
                                    <Col md={6}>
                                      <h4>Equity Metrics</h4>
                                      <h6>Net Position</h6>
                                      {DualLineChart(dataSets[activeKey], 'assets', 'liabilities', 'netPosition', 'green', 'red', 'blue')}
                                      <h6>Years of Solvency</h6>
                                      {DualLineChart(dataSets[activeKey], 'liquidity', 'opex', 'perpetuity', '#8884d8', '#ffc658')}
                                      <h6>Demand for Capital</h6>
                                      {SingleLineChart(dataSets[activeKey], 'liquidity', '#ff7300')}
                                    </Col>
                                    <Col md={6}>
                                      <h4>Cash Flow Metrics</h4>
                                      <h6>Financing</h6>
                                      {DoubleLineChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                                      <h6>Years of Solvency Based on Cash Flow</h6>
                                      {DualLineChart(dataSets[activeKey], 'cashInFlow', 'cashOutFlow', 'netCashFlow', '#8884d8', '#ff7300', 'orange')}
                                      <h6>Budget</h6>
                                      {DualLineChart(dataSets[activeKey], 'budget', 'actualAndEncumbrance', 'changeAE', '#f17e5d', 'brown', 'pink')}
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </>
                  )}
                  {activeKey === '4year' && (
                    <>
                      <Button onClick={() => toggleDataVisibility('4year')} variant="link">
                        {isDataVisible['4year'] ? 'Hide Data' : 'Show Data'}
                      </Button>
                      {isDataVisible['4year'] && renderSnapshotTable(dataSets['4year'])}
                      <Row>
                        <Col md={6}>
                          <h4>Equity Metrics</h4>
                          <h6>Net Position</h6>
                          {DualLineChart(dataSets[activeKey], 'assets', 'liabilities', 'netPosition', 'green', 'red', 'blue')}
                          <h6>Years of Solvency</h6>
                          {DualLineChart(dataSets[activeKey], 'liquidity', 'opex', 'perpetuity', '#8884d8', '#ffc658')}
                          <h6>Demand for Capital</h6>
                          {SingleLineChart(dataSets[activeKey], 'liquidity', '#ff7300')}
                        </Col>
                        <Col md={6}>
                          <h4>Cash Flow Metrics</h4>
                          <h6>Financing</h6>
                          {DoubleLineChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                          <h6>Years of Solvency Based on Cash Flow</h6>
                          {DualLineChart(dataSets[activeKey], 'cashInFlow', 'cashOutFlow', 'netCashFlow', '#8884d8', '#ff7300', 'orange')}
                          <h6>Budget</h6>
                          {DualLineChart(dataSets[activeKey], 'budget', 'actualAndEncumbrance', 'changeAE', '#f17e5d', 'brown', 'pink')}
                        </Col>
                      </Row>
                    </>
                  )}
                  {activeKey === '8year' && (
                    <>
                      <Button onClick={() => toggleDataVisibility('8year')} variant="link">
                        {isDataVisible['8year'] ? 'Hide Data' : 'Show Data'}
                      </Button>
                      {isDataVisible['8year'] && renderSnapshotTable(dataSets['8year'])}
                      <Row>
                        <Col md={6}>
                          <h4>Equity Metrics</h4>
                          <h6>Net Position</h6>
                          {DualLineChart(dataSets[activeKey], 'assets', 'liabilities', 'netPosition', 'green', 'red', 'blue')}
                          <h6>Years of Solvency</h6>
                          {DualLineChart(dataSets[activeKey], 'liquidity', 'opex', 'perpetuity', '#8884d8', '#ffc658')}
                          <h6>Demand for Capital</h6>
                          {SingleLineChart(dataSets[activeKey], 'liquidity', '#ff7300')}
                        </Col>
                        <Col md={6}>
                          <h4>Cash Flow Metrics</h4>
                          <h6>Financing</h6>
                          {DoubleLineChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                          <h6>Years of Solvency Based on Cash Flow</h6>
                          {DualLineChart(dataSets[activeKey], 'cashInFlow', 'cashOutFlow', 'netCashFlow', '#8884d8', '#ff7300', 'orange')}
                          <h6>Budget</h6>
                          {DualLineChart(dataSets[activeKey], 'budget', 'actualAndEncumbrance', 'changeAE', '#f17e5d', 'brown', 'pink')}
                        </Col>
                      </Row>
                    </>
                  )}
                  {activeKey === '12year' && (
                    <>
                      <Button onClick={() => toggleDataVisibility('12year')} variant="link">
                        {isDataVisible['12year'] ? 'Hide Data' : 'Show Data'}
                      </Button>
                      {isDataVisible['12year'] && renderSnapshotTable(dataSets['12year'])}
                      <Row>
                        <Col md={6}>
                          <h4>Equity Metrics</h4>
                          <h6>Net Position</h6>
                          {DualLineChart(dataSets[activeKey], 'assets', 'liabilities', 'netPosition', 'green', 'red', 'blue')}
                          <h6>Years of Solvency</h6>
                          {DualLineChart(dataSets[activeKey], 'liquidity', 'opex', 'perpetuity', '#8884d8', '#ffc658')}
                          <h6>Demand for Capital</h6>
                          {SingleLineChart(dataSets[activeKey], 'liquidity', '#ff7300')}
                        </Col>
                        <Col md={6}>
                          <h4>Cash Flow Metrics</h4>
                          <h6>Financing</h6>
                          {DoubleLineChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                          <h6>Years of Solvency Based on Cash Flow</h6>
                          {DualLineChart(dataSets[activeKey], 'cashInFlow', 'cashOutFlow', 'netCashFlow', '#8884d8', '#ff7300', 'orange')}
                          <h6>Budget</h6>
                          {DualLineChart(dataSets[activeKey], 'budget', 'actualAndEncumbrance', 'changeAE', '#f17e5d', 'brown', 'pink')}
                        </Col>
                      </Row>
                    </>
                  )}
                  {activeKey === 'comparison' && <Comparison />}
                </>
              ) : (<p>Loading data...</p>

              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VisualizationExport;
