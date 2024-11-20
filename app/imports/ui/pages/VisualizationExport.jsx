import React, { useState } from 'react';
import { Col, Container, Row, Card, Table, Nav, Form, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import ChartComponent from '../components/ChartComponent';
import { AuditedBalanceData } from '../../api/audited-balance-data/AuditedBalanceDataCollection';
// Currency formatter
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format;

const renderAuditedDataTable = (data) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Year</th>
        <th>Cash Total</th>
        <th>Other Total</th>
        <th>Investments Total</th>
        <th>Loan Fund Total</th>
        <th>Assets Total</th>
        <th>Liabilities Total</th>
        <th>Total Liabilities and Resources</th>
        <th>Total Net</th>
      </tr>
    </thead>
    <tbody>
      {data.map((entry, index) => (
        <tr key={index}>
          <td>{entry.year}</td>
          <td>{currencyFormatter(entry.cashTotal || 0)}</td>
          <td>{currencyFormatter(entry.otherTotal || 0)}</td>
          <td>{currencyFormatter(entry.investmentsTotal || 0)}</td>
          <td>{currencyFormatter(entry.loanFundTotal || 0)}</td>
          <td>{currencyFormatter(entry.assetsTotal || 0)}</td>
          <td>{currencyFormatter(entry.liabilitiesTotal || 0)}</td>
          <td>{currencyFormatter(entry.liabInflowRsrcsTotal || 0)}</td>
          <td>{currencyFormatter(entry.totalNet || 0)}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);
// Comparison Component with projections
const Comparison = ({ data }) => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMetric1, setSelectedMetric1] = useState('totalNet');
  const [selectedMetric2, setSelectedMetric2] = useState('assetsTotal');
  const [projectionPercentage, setProjectionPercentage] = useState(0);
  const [projectionYears, setProjectionYears] = useState(0);
  const [showProjection, setShowProjection] = useState(false);

  const handleYearSelect = (year) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
  };

  const calculateProjections = (baseYearData) => {
    const projections = [];
    let lastValue1 = baseYearData[selectedMetric1];
    let lastValue2 = baseYearData[selectedMetric2];

    for (let i = 1; i <= projectionYears; i++) {
      lastValue1 *= 1 + projectionPercentage / 100;
      lastValue2 *= 1 + projectionPercentage / 100;

      projections.push({
        year: (parseInt(baseYearData.year) + i).toString(),
        [selectedMetric1]: lastValue1,
        [selectedMetric2]: lastValue2,
      });
    }
    return projections;
  };

  const filteredData = data.filter((entry) => selectedYears.includes(entry.year));
  const baseYearData = filteredData[0];
  const projectionData = showProjection && baseYearData ? calculateProjections(baseYearData) : [];

  return (
    <Card.Body>
      <h5>Select Years to Compare</h5>
      <Form>
        <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
          {data.map((entry, index) => (
            <Button
              key={index}
              className={`button-square ${selectedYears.includes(entry.year) ? 'selected' : ''}`}
              style={{ marginRight: '15px' }}
              onClick={() => handleYearSelect(entry.year)}
            >
              {entry.year}
            </Button>
          ))}
        </div>
        <Form.Group controlId="metric1">
          <Form.Label>Choose First Metric:</Form.Label>
          <Form.Control
            as="select"
            value={selectedMetric1}
            onChange={(e) => setSelectedMetric1(e.target.value)}
          >
            <option value="assetsTotal">Assets Total</option>
            <option value="liabilitiesTotal">Liabilities Total</option>
            <option value="totalNet">Net Position</option>
            <option value="cashTotal">Cash Total</option>
            <option value="loanFundTotal">Loan Fund Total</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="metric2">
          <Form.Label>Choose Second Metric:</Form.Label>
          <Form.Control
            as="select"
            value={selectedMetric2}
            onChange={(e) => setSelectedMetric2(e.target.value)}
          >
            <option value="assetsTotal">Assets Total</option>
            <option value="liabilitiesTotal">Liabilities Total</option>
            <option value="totalNet">Net Position</option>
            <option value="cashTotal">Cash Total</option>
            <option value="loanFundTotal">Loan Fund Total</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="projectionToggle">
          <Form.Check
            type="switch"
            label="Show Projections"
            checked={showProjection}
            onChange={() => setShowProjection(!showProjection)}
          />
        </Form.Group>
        {showProjection && (
          <>
            <Form.Group controlId="projectionPercentage">
              <Form.Label>Projection Percentage Increase:</Form.Label>
              <Form.Control
                type="number"
                value={projectionPercentage}
                onChange={(e) => setProjectionPercentage(parseFloat(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="projectionYears">
              <Form.Label>Number of Years for Projection:</Form.Label>
              <Form.Control
                type="number"
                value={projectionYears}
                onChange={(e) => setProjectionYears(parseInt(e.target.value, 10))}
              />
            </Form.Group>
          </>
        )}
        {filteredData.length > 0 && (
          <ChartComponent
            data={[...filteredData, ...projectionData]}
            chartType="dual"
            key1={selectedMetric1}
            key2={selectedMetric2}
            color1="#8884d8"
            color2="#82ca9d"
            width={400}
            height={400}
          />
        )}
      </Form>
    </Card.Body>
  );
};

const VisualizationExport = ({ auditedData }) => {
  const [activeKey, setActiveKey] = useState('snapshot');
  const [isDataVisible, setIsDataVisible] = useState({
    snapshot: true,
    '4year': false,
    '8year': false,
    '12year': false,
  });

  const dataSets = {
    snapshot: auditedData,
    '4year': auditedData.slice(0, 4),
    '8year': auditedData.slice(0, 8),
    '12year': auditedData,
  };

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
              {activeKey === 'snapshot' && (
                <>
                  <Button onClick={() => toggleDataVisibility('snapshot')} variant="link">
                    {isDataVisible.snapshot ? 'Hide Data' : 'Show Data'}
                  </Button>
                  {isDataVisible.snapshot && renderAuditedDataTable(dataSets.snapshot)}
                </>
              )}
              {['4year', '8year', '12year'].includes(activeKey) && (
                <>
                  <Button onClick={() => toggleDataVisibility(activeKey)} variant="link">
                    {isDataVisible[activeKey] ? 'Hide Data' : 'Show Data'}
                  </Button>
                  {isDataVisible[activeKey] && renderAuditedDataTable(dataSets[activeKey])}
                  <Row>
                    <Col md={6}>
                      <h4>Equity Metrics</h4>
                      <h6>Net Position</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="triple"
                        key1="assetsTotal"
                        key2="liabilitiesTotal"
                        key3="totalNet"
                        color1="green"
                        color2="red"
                        color3="blue"
                      />
                      <h6>Years of Solvency</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="assetsTotal"
                        key2="opex"
                        color1="#8884d8"
                        color2="#ffc658"
                      />
                      <h6>Demand for Capital</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key1="assetsTotal"
                        color1="#ff7300"
                      />
                    </Col>
                    <Col md={6}>
                      <h4>Cash Flow Metrics</h4>
                      <h6>Financing</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key1="opex"
                        color1="#82ca9d"
                      />
                      <h6>Years of Solvency Based on Cash Flow</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="assetsTotal"
                        key2="loanFundTotal"
                        color1="blue"
                        color2="red"
                      />
                      <h6>Budget</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="triple"
                        key1="budget"
                        key2="actualAndEncumbrance"
                        key3="changeAE"
                        color1="red"
                        color2="blue"
                        color3="green"
                      />
                    </Col>
                  </Row>
                </>
              )}
              {activeKey === 'comparison' && <Comparison data={auditedData} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default withTracker(() => {
  // Subscribe to the collection
  Meteor.subscribe('AuditedBalanceData');

  // Fetch data from the collection
  const auditedData = AuditedBalanceData.find({}).fetch();

  return {
    auditedData,
  };
})(VisualizationExport);
