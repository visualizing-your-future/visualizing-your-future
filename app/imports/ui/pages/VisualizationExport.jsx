import React, { useState } from 'react';
import { Col, Container, Row, Card, Table, Nav, Form, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Currency formatter
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format;

// Snapshot data
const snapshotData = [
  { year: 'YEAR 1', assets: 660137198, liabilities: 510692581, netPosition: 149444617, cashOnHand: 143912689, investment: 354178236, utility: 33543139, debt: 214615747, revenues: 373746543, opex: 83585519, netIncome: 290160023 },
  { year: 'YEAR 2', assets: 670492102, liabilities: 514859093, netPosition: 155633009, cashOnHand: 145654721, investment: 360744805, utility: 33890716, debt: 30865457, revenues: 377663608, opex: 82616033, netIncome: 295047575 },
  { year: 'YEAR 3', assets: 680447782, liabilities: 519201382, netPosition: 161246400, cashOnHand: 146679046, investment: 367721859, utility: 34229610, debt: 30160955, revenues: 381852765, opex: 81680554, netIncome: 300172211 },
  { year: 'YEAR 4', assets: 703048834, liabilities: 538002209, netPosition: 165046625, cashOnHand: 148155895, investment: 375076157, utility: 34571906, debt: 21740000, revenues: 384892873, opex: 80782546, netIncome: 304110328 },
  { year: 'YEAR 5', assets: 710534774, liabilities: 541920356, netPosition: 168614418, cashOnHand: 150601672, investment: 381455788, utility: 34916256, debt: 24000000, revenues: 389168412, opex: 79904739, netIncome: 309263674 },
  { year: 'YEAR 6', assets: 720452877, liabilities: 547057409, netPosition: 173395468, cashOnHand: 151235432, investment: 387456191, utility: 35263474, debt: 18000000, revenues: 392711670, opex: 79103646, netIncome: 313607024 },
  { year: 'YEAR 7', assets: 731007202, liabilities: 552489676, netPosition: 178517526, cashOnHand: 153124212, investment: 393616743, utility: 35613609, debt: 15000000, revenues: 396873882, opex: 78312649, netIncome: 318561233 },
  { year: 'YEAR 8', assets: 741062577, liabilities: 557485527, netPosition: 183577050, cashOnHand: 155089623, investment: 399617188, utility: 35966746, debt: 11000000, revenues: 401468479, opex: 77529552, netIncome: 322938926 },
  { year: 'YEAR 9', assets: 751289702, liabilities: 562875247, netPosition: 188414455, cashOnHand: 157065454, investment: 405856784, utility: 36322892, debt: 9500000, revenues: 406140649, opex: 76763979, netIncome: 327376670 },
  { year: 'YEAR 10', assets: 761723302, liabilities: 568658572, netPosition: 193064730, cashOnHand: 159028764, investment: 412356371, utility: 36682021, debt: 8500000, revenues: 410968473, opex: 76009780, netIncome: 331958693 },
  { year: 'YEAR 11', assets: 772687307, liabilities: 574756277, netPosition: 197931030, cashOnHand: 161090902, investment: 418885256, utility: 37044141, debt: 12500000, revenues: 415918121, opex: 75259766, netIncome: 336658355 },
  { year: 'YEAR 12', assets: 785147763, liabilities: 581178072, netPosition: 203969691, cashOnHand: 163101587, investment: 425345634, utility: 37409267, debt: 15000000, revenues: 420929856, opex: 74514609, netIncome: 341415247 },
];

// Hard-coded data for different year projections
const dataSets = {
  snapshot: snapshotData,
  '4year': snapshotData.slice(0, 4), // Using first 4 years
  '8year': snapshotData.slice(0, 8), // Using first 8 years
  '12year': snapshotData, // All 12 years
};

// Function to render the Excel-like table for snapshot
const renderSnapshotTable = (data) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Year</th>
        <th>Assets</th>
        <th>Liabilities</th>
        <th>Net Position</th>
        <th>Cash on Hand</th>
        <th>Investment</th>
        <th>Utility</th>
        <th>Debt</th>
        <th>Revenues</th>
        <th>Opex</th>
        <th>Net Income</th>
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
          <td>{currencyFormatter(entry.investment)}</td>
          <td>{currencyFormatter(entry.utility)}</td>
          <td>{currencyFormatter(entry.debt)}</td>
          <td>{currencyFormatter(entry.revenues)}</td>
          <td>{currencyFormatter(entry.opex)}</td>
          <td>{currencyFormatter(entry.netIncome)}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

// Function to render a dual line chart for comparison
const renderDualChart = (data, key1, key2, color1, color2) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis tickFormatter={(value) => currencyFormatter(value)} />
      <Tooltip formatter={(value) => currencyFormatter(value)} />
      <Legend />
      <Line type="monotone" dataKey={key1} stroke={color1} activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey={key2} stroke={color2} activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);

// Function to render single line chart
// eslint-disable-next-line no-unused-vars
const renderSingleChart = (data, key, color) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis tickFormatter={(value) => currencyFormatter(value)} />
      <Tooltip formatter={(value) => currencyFormatter(value)} />
      <Legend />
      <Line type="monotone" dataKey={key} stroke={color} activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);

// Comparison Component
// eslint-disable-next-line react/prop-types
const Comparison = ({ data }) => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMetric1, setSelectedMetric1] = useState('netPosition');
  const [selectedMetric2, setSelectedMetric2] = useState('assets');

  const handleYearSelect = (year) => {
    setSelectedYears((prev) => {
      const isSelected = prev.includes(year);
      return isSelected ? prev.filter((y) => y !== year) : [...prev, year];
    });
  };

  const handleMetricChange = (metric, isFirstMetric) => {
    if (isFirstMetric) {
      setSelectedMetric1(metric);
    } else {
      setSelectedMetric2(metric);
    }
  };

  // eslint-disable-next-line react/prop-types
  const filteredData = data.filter((entry) => selectedYears.includes(entry.year));

  return (
    <Card.Body>
      <h5>Select Years to Compare</h5>
      <Form>
        {/* eslint-disable-next-line react/prop-types */}
        {data.map((entry, index) => (
          <Form.Check
            key={index}
            type="checkbox"
            id={`year-${index}`}
            label={entry.year}
            checked={selectedYears.includes(entry.year)}
            onChange={() => handleYearSelect(entry.year)}
          />
        ))}
        <Form.Group controlId="metric1">
          <Form.Label>Choose First Metric:</Form.Label>
          <Form.Control as="select" value={selectedMetric1} onChange={(e) => handleMetricChange(e.target.value, true)}>
            <option value="netPosition">Net Position</option>
            <option value="cashOnHand">Cash on Hand</option>
            <option value="debt">Debt</option>
            <option value="revenues">Revenues</option>
            <option value="opex">Opex</option>
            <option value="netIncome">Net Income</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="metric2">
          <Form.Label>Choose Second Metric:</Form.Label>
          <Form.Control as="select" value={selectedMetric2} onChange={(e) => handleMetricChange(e.target.value, false)}>
            <option value="assets">Assets</option>
            <option value="liabilities">Liabilities</option>
            <option value="cashOnHand">Cash on Hand</option>
            <option value="debt">Debt</option>
            <option value="revenues">Revenues</option>
            <option value="opex">Opex</option>
            <option value="netIncome">Net Income</option>
          </Form.Control>
        </Form.Group>
      </Form>
      {filteredData.length > 0 && renderDualChart(filteredData, selectedMetric1, selectedMetric2, '#8884d8', '#82ca9d')}
    </Card.Body>
  );
};

// Main VisualizationExport component
const VisualizationExport = () => {
  const [activeKey, setActiveKey] = useState('snapshot');
  const [isDataVisible, setIsDataVisible] = useState({
    snapshot: true,
    '4year': true,
    '8year': true,
    '12year': true,
  });

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
                  {isDataVisible.snapshot && renderSnapshotTable(dataSets.snapshot)}
                  <Row>
                    <Col>
                      <Card className="mt-3">
                        <Card.Body>
                          {activeKey && (
                            <>
                              <h5>{activeKey.toUpperCase()} View</h5>
                              <Row>
                                <Col lg={6}>
                                  <h6>Table 1: Assets and Liabilities</h6>
                                  {renderDualChart(dataSets[activeKey], 'assets', 'liabilities', '#f17e5d', '#246aae')}
                                </Col>
                                <Col lg={6}>
                                  <h6>Table 4: Cash On Hand and Debt</h6>
                                  {renderDualChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={6}>
                                  <h6>Table 2: Liquidity and Opex</h6>
                                  {renderDualChart(dataSets[activeKey], 'netPosition', 'opex', '#8884d8', '#ffc658')}
                                </Col>
                                <Col lg={6}>
                                  <h6>Table 5: Cash In Flow and Cash Out Flow</h6>
                                  {renderDualChart(dataSets[activeKey], 'revenues', 'opex', '#8884d8', '#ff7300')}
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={6}>
                                  <h6>Table 3: Liquidity</h6>
                                  {renderDualChart(dataSets[activeKey], 'cashOnHand', 'investment', '#82ca9d', '#ff7300')}
                                </Col>
                                <Col lg={6}>
                                  <h6>Table 6: Budget and Actual + Encumbrance</h6>
                                  {renderDualChart(dataSets[activeKey], 'revenues', 'netIncome', '#246aae', '#f17e5d')}
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
                      {renderDualChart(dataSets[activeKey], 'assets', 'liabilities', '#f17e5d', '#246aae')}
                      {renderDualChart(dataSets[activeKey], 'netPosition', 'opex', '#8884d8', '#ffc658')}
                      {renderDualChart(dataSets[activeKey], 'cashOnHand', 'investment', '#82ca9d', '#ff7300')}
                    </Col>
                    <Col md={6}>
                      <h4>Cash Flow Metrics</h4>
                      {renderDualChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                      {renderDualChart(dataSets[activeKey], 'revenues', 'opex', '#8884d8', '#ff7300')}
                      {renderDualChart(dataSets[activeKey], 'revenues', 'netIncome', '#246aae', '#f17e5d')}
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
                      {renderDualChart(dataSets[activeKey], 'assets', 'liabilities', '#f17e5d', '#246aae')}
                      {renderDualChart(dataSets[activeKey], 'netPosition', 'opex', '#8884d8', '#ffc658')}
                      {renderDualChart(dataSets[activeKey], 'cashOnHand', 'investment', '#82ca9d', '#ff7300')}
                    </Col>
                    <Col md={6}>
                      <h4>Cash Flow Metrics</h4>
                      {renderDualChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                      {renderDualChart(dataSets[activeKey], 'revenues', 'opex', '#8884d8', '#ff7300')}
                      {renderDualChart(dataSets[activeKey], 'revenues', 'netIncome', '#246aae', '#f17e5d')}
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
                      {renderDualChart(dataSets[activeKey], 'assets', 'liabilities', '#f17e5d', '#246aae')}
                      {renderDualChart(dataSets[activeKey], 'netPosition', 'opex', '#8884d8', '#ffc658')}
                      {renderDualChart(dataSets[activeKey], 'cashOnHand', 'investment', '#82ca9d', '#ff7300')}
                    </Col>
                    <Col md={6}>
                      <h4>Cash Flow Metrics</h4>
                      {renderDualChart(dataSets[activeKey], 'cashOnHand', 'debt', '#82ca9d', '#e64b37')}
                      {renderDualChart(dataSets[activeKey], 'revenues', 'opex', '#8884d8', '#ff7300')}
                      {renderDualChart(dataSets[activeKey], 'revenues', 'netIncome', '#246aae', '#f17e5d')}
                    </Col>
                  </Row>
                </>
              )}
              {activeKey === 'comparison' && <Comparison data={snapshotData} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VisualizationExport;
