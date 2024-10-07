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
  { year: 'YEAR 1', assets: 689525419, liabilities: 141198657, netPosition: 548326762, cashOnHand: 20091667, investment: 402514152, utility: 33543139, debt: 66193143, revenues: 35693705, opex: 35603263, netIncome: 290160023 },
  { year: 'YEAR 2', assets: 698716700, liabilities: 117607300, netPosition: 581109400, cashOnHand: 22647878, investment: 410021540, utility: 33890716, debt: 41686286, revenues: 35567019, opex: 36014771, netIncome: 295047575 },
  { year: 'YEAR 3', assets: 691355317, liabilities: 116810541, netPosition: 574544776, cashOnHand: 18695599, investment: 409541918, utility: 34229610, debt: 41179429, revenues: 35914282, opex: 36803493, netIncome: 300172211 },
  { year: 'YEAR 4', assets: 700301819, liabilities: 113248353, netPosition: 587053466, cashOnHand: 21592948, investment: 418441322, utility: 34571906, debt: 37672571, revenues: 36670341, opex: 37218414, netIncome: 304110328 },
  { year: 'YEAR 5', assets: 701042985, liabilities: 109830826, netPosition: 591212159, cashOnHand: 17757200, investment: 427149326, utility: 34916256, debt: 34165714, revenues: 37234517, opex: 37666058, netIncome: 309263674 },
  { year: 'YEAR 6', assets: 710578887, liabilities: 106283192, netPosition: 604295695, cashOnHand: 20972538, investment: 435928758, utility: 35263474, debt: 30658857, revenues: 38102065, opex: 38215618, netIncome: 313607024 },
  { year: 'YEAR 7', assets: 713017483, liabilities: 102772409, netPosition: 610245073, cashOnHand: 17415528, investment: 444325230, utility: 35966746, debt: 27152000, revenues: 39997851, opex: 38832666, netIncome: 322938926 },
  { year: 'YEAR 8', assets: 722460461, liabilities: 99636285, netPosition: 622824176, cashOnHand: 21208373, investment: 452349231, utility: 36322892, debt: 24000000, revenues: 39920149, opex: 39532314, netIncome: 327376670 },
  { year: 'YEAR 9', assets: 724022577, liabilities: 96626677, netPosition: 627395900, cashOnHand: 17584723, investment: 459947864, utility: 36682021, debt: 21000000, revenues: 40349674, opex: 40180479, netIncome: 331958693 },
  { year: 'YEAR 10', assets: 734013691, liabilities: 93628457, netPosition: 640385234, cashOnHand: 21119245, investment: 467595644, utility: 37044141, debt: 18000000, revenues: 40751477, opex: 40840605, netIncome: 336658355 },
  { year: 'YEAR 11', assets: 737837542, liabilities: 90630473, netPosition: 647207069, cashOnHand: 17193578, investment: 475341162, utility: 37409267, debt: 15000000, revenues: 41142891, opex: 41534037, netIncome: 341415247 },
  { year: 'YEAR 12', assets: 748903774, liabilities: 87628202, netPosition: 661275572, cashOnHand: 20404255, investment: 483198717, utility: 37409267, debt: 12000000, revenues: 41534656, opex: 42249646, netIncome: 341415247 },

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
const renderDualChart = (data, key1, key2, key3, color1, color2, color3) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis tickFormatter={(value) => currencyFormatter(value)} />
      <Tooltip formatter={(value) => currencyFormatter(value)} />
      <Legend />
      <Line type="monotone" dataKey={key1} stroke={color1} activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey={key2} stroke={color2} activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey={key3} stroke={color3} activeDot={{ r: 8 }} />
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
  const [selectedMetric3, setSelectedMetric3] = useState('debt');

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
    snapshot: false,
    '4year': false,
    '8year': false,
    '12year': false,
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
                                  <h6>Table 1: Net Position</h6>
                                  {renderDualChart(dataSets[activeKey], 'assets', 'liabilities', 'netPosition', '#f17e5d', '#246aae', '#8884d8')}
                                </Col>
                                <Col lg={6}>
                                  <h6>Table 4: Financing</h6>
                                  {renderDualChart(dataSets[activeKey], 'cashOnHand', 'debt', '', '#82ca9d', '#e64b37', '#e64b37')}
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={6}>
                                  <h6>Table 2: Years of Solvency</h6>
                                  {renderDualChart(dataSets[activeKey], 'netPosition', 'opex', '#8884d8', '#ffc658')}
                                </Col>
                                <Col lg={6}>
                                  <h6>Table 5: Years of Solvency Based on Cash Flow</h6>
                                  {renderDualChart(dataSets[activeKey], 'revenues', 'opex', '#8884d8', '#ff7300')}
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={6}>
                                  <h6>Table 3: Demand For Capital</h6>
                                  {renderDualChart(dataSets[activeKey], 'cashOnHand', 'investment', '#82ca9d', '#ff7300')}
                                </Col>
                                <Col lg={6}>
                                  <h6>Table 6: Budget</h6>
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
