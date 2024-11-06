import React, { useState } from 'react';
import { Col, Container, Row, Card, Table, Nav, Form, Button } from 'react-bootstrap';
import ChartComponent from '../components/ChartComponent';

// Currency formatter
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format;

const snapshotData = [{
  year: 'YEAR 1',
  assets: 689525419,
  liabilities: 141198657,
  netPosition: 548326762,
  cashOnHand: 20091667,
  debt: 66193143,
  opex: 35603263,
  liquidity: 422605819,
  perpetuity: 0,
  cashInFlow: 35693705,
  cashOutFlow: 36110120,
  netCashFlow: 416415,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 2',
  assets: 698716700,
  liabilities: 117607300,
  netPosition: 581109400,
  cashOnHand: 22647878,
  debt: 41686286,
  opex: 36014771,
  liquidity: 432669418,
  perpetuity: 0,
  cashInFlow: 35567019,
  cashOutFlow: 36521628,
  netCashFlow: 954609,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 3',
  assets: 691355317,
  liabilities: 116810541,
  netPosition: 574544776,
  cashOnHand: 18695599,
  debt: 41179429,
  opex: 36803493,
  liquidity: 428237517,
  perpetuity: 0,
  cashInFlow: 35914282,
  cashOutFlow: 37310350,
  netCashFlow: 1396068,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 4',
  assets: 700301819,
  liabilities: 113248353,
  netPosition: 587053466,
  cashOnHand: 21592948,
  debt: 37672571,
  opex: 37218414,
  liquidity: 440034270,
  perpetuity: 0,
  cashInFlow: 36670341,
  cashOutFlow: 37725271,
  netCashFlow: 1054930,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 5',
  assets: 701042985,
  liabilities: 109830826,
  netPosition: 591212159,
  cashOnHand: 17757200,
  debt: 34165714,
  opex: 37666058,
  liquidity: 444906527,
  perpetuity: 0,
  cashInFlow: 37234517,
  cashOutFlow: 38172915,
  netCashFlow: 938399,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 6',
  assets: 710578887,
  liabilities: 106283192,
  netPosition: 604295695,
  cashOnHand: 20972538,
  debt: 30658857,
  opex: 38215618,
  liquidity: 456901296,
  perpetuity: 0,
  cashInFlow: 38102065,
  cashOutFlow: 38722475,
  netCashFlow: 620410,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 7',
  assets: 713017483,
  liabilities: 102772409,
  netPosition: 610245073,
  cashOnHand: 17415528,
  debt: 27152000,
  opex: 38832666,
  liquidity: 461740759,
  perpetuity: 0,
  cashInFlow: 38997851,
  cashOutFlow: 39339523,
  netCashFlow: 341672,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 8',
  assets: 722460461,
  liabilities: 99636285,
  netPosition: 622824176,
  cashOnHand: 21208373,
  debt: 24000000,
  opex: 39532314,
  liquidity: 473557604,
  perpetuity: 0,
  cashInFlow: 39920149,
  cashOutFlow: 39684314,
  netCashFlow: 235835,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 9',
  assets: 724022577,
  liabilities: 96626677,
  netPosition: 627395900,
  cashOnHand: 17584723,
  debt: 21000000,
  opex: 40180479,
  liquidity: 477532588,
  perpetuity: 0,
  cashInFlow: 40349674,
  cashOutFlow: 40180479,
  netCashFlow: 169195,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 10',
  assets: 734013691,
  liabilities: 93628457,
  netPosition: 640385234,
  cashOnHand: 21119245,
  debt: 18000000,
  opex: 40840605,
  liquidity: 488714889,
  perpetuity: 0,
  cashInFlow: 40751477,
  cashOutFlow: 40840605,
  netCashFlow: 89128,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 11',
  assets: 737837542,
  liabilities: 90630473,
  netPosition: 647207069,
  cashOnHand: 17193578,
  debt: 15000000,
  opex: 41534037,
  liquidity: 492534740,
  perpetuity: 0,
  cashInFlow: 41142891,
  cashOutFlow: 41534037,
  netCashFlow: 391145,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}, {
  year: 'YEAR 12',
  assets: 748903774,
  liabilities: 87628202,
  netPosition: 661275572,
  cashOnHand: 20404255,
  debt: 12000000,
  opex: 42249646,
  liquidity: 503602972,
  perpetuity: 0,
  cashInFlow: 41534656,
  cashOutFlow: 42249646,
  netCashFlow: 714990,
  budget: 0,
  actualAndEncumbrance: 0,
  changeAE: 0,
}];

const dataSets = {
  snapshot: snapshotData,
  '4year': snapshotData.slice(0, 4),
  '8year': snapshotData.slice(0, 8),
  '12year': snapshotData,
};

// Comparison Component
// eslint-disable-next-line react/prop-types
const Comparison = ({ data }) => {
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMetric1, setSelectedMetric1] = useState('netPosition');
  const [selectedMetric2, setSelectedMetric2] = useState('assets');
  // eslint-disable-next-line no-unused-vars
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
        <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
          {/* eslint-disable-next-line react/prop-types */}
          {data.map((entry, index) => (
            <Button
              key={index}
              variant={selectedYears.includes(entry.year) ? 'button-square' : 'button-square'}
              style={{ marginRight: '15px' }}
              active={selectedYears.includes(entry.year)}
              onClick={() => handleYearSelect(entry.year)}
            >
              {entry.year}
            </Button>
          ))}
        </div>
        <Form.Group controlId="metric1">
          <Form.Label>Choose First Metric:</Form.Label>
          <Form.Control as="select" value={selectedMetric1} onChange={(e) => handleMetricChange(e.target.value, true)}>
            <option value="assets">Assets</option>
            <option value="liabilitites">Liabilities</option>
            <option value="netPosition">Net Position</option>
            <option value="cashOnHand">Cash on Hand</option>
            <option value="debt">Debt</option>
            <option value="opex">Opex</option>
            <option value="liquidity">Liquidity</option>
            <option value="perpetuitiy">Perpetuity</option>
            <option value="cashInFlow">Cash In Flow</option>
            <option value="cashOutFlow">Cash Out Flow</option>
            <option value="netCashFlow">Net Cash Flow</option>
            <option value="budget">Budget</option>
            <option value="actualAndEncumbrance">Actual + Encumbrance</option>
            <option value="changeAE">Change of Actual + Encumbrance</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="metric2">
          <Form.Label>Choose Second Metric:</Form.Label>
          <Form.Control as="select" value={selectedMetric2} onChange={(e) => handleMetricChange(e.target.value, false)}>
            <option value="assets">Assets</option>
            <option value="liabilitites">Liabilities</option>
            <option value="netPosition">Net Position</option>
            <option value="cashOnHand">Cash on Hand</option>
            <option value="debt">Debt</option>
            <option value="opex">Opex</option>
            <option value="liquidity">Liquidity</option>
            <option value="perpetuitiy">Perpetuity</option>
            <option value="cashInFlow">Cash In Flow</option>
            <option value="cashOutFlow">Cash Out Flow</option>
            <option value="netCashFlow">Net Cash Flow</option>
            <option value="budget">Budget</option>
            <option value="actualAndEncumbrance">Actual + Encumbrance</option>
            <option value="changeAE">Change of Actual + Encumbrance</option>
          </Form.Control>
        </Form.Group>
      </Form>
      {filteredData.length > 0 && (
        <div style={{ marginTop: '40px', height: '110%' }}> {/* Keep square aspect ratio */}
          <ChartComponent
            data={filteredData}
            chartType="dual"
            key1={selectedMetric1}
            key2={selectedMetric2}
            color1="#8884d8"
            color2="#82ca9d"
            width={400}
            height={400}
          />
        </div>
      )}
    </Card.Body>
  );
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
                                <Col md={6}>
                                  <h4>Equity Metrics</h4>
                                  <h6>Net Position</h6>
                                  <ChartComponent
                                    data={dataSets[activeKey]}
                                    chartType="triple"
                                    key1="assets"
                                    key2="liabilities"
                                    key3="netPosition"
                                    color1="green"
                                    color2="red"
                                    color3="blue"
                                  />
                                  <h6>Years of Solvency</h6>
                                  <ChartComponent
                                    data={dataSets[activeKey]}
                                    chartType="dual"
                                    key1="liquidity"
                                    key2="opex"
                                    color1="#8884d8"
                                    color2="#ffc658"
                                  />
                                  <h6>Demand for Capital</h6>
                                  <ChartComponent
                                    data={dataSets[activeKey]}
                                    chartType="single"
                                    key="liquidity"
                                    color="#ff7300"
                                  />
                                </Col>
                                <Col md={6}>
                                  <h4>Cash Flow Metrics</h4>
                                  <h6>Financing</h6>
                                  <ChartComponent
                                    data={dataSets[activeKey]}
                                    chartType="single"
                                    key="opex"
                                    color="#82ca9d"
                                  />
                                  <h6>Years of Solvency Based on Cash Flow</h6>
                                  <ChartComponent
                                    data={dataSets[activeKey]}
                                    chartType="dual"
                                    key1="liquidity"
                                    key2="debt"
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
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="triple"
                        key1="assets"
                        key2="liabilities"
                        key3="netPosition"
                        color1="green"
                        color2="red"
                        color3="blue"
                      />
                      <h6>Years of Solvency</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="liquidity"
                        key2="opex"
                        color1="#8884d8"
                        color2="#ffc658"
                      />
                      <h6>Demand for Capital</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key="liquidity"
                        color="#ff7300"
                      />
                    </Col>
                    <Col md={6}>
                      <h4>Cash Flow Metrics</h4>
                      <h6>Financing</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key="opex"
                        color="#82ca9d"
                      />
                      <h6>Years of Solvency Based on Cash Flow</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="liquidity"
                        key2="debt"
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
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="triple"
                        key1="assets"
                        key2="liabilities"
                        key3="netPosition"
                        color1="green"
                        color2="red"
                        color3="blue"
                      />
                      <h6>Years of Solvency</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="liquidity"
                        key2="opex"
                        color1="#8884d8"
                        color2="#ffc658"
                      />
                      <h6>Demand for Capital</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key="liquidity"
                        color="#ff7300"
                      />
                    </Col>
                    <Col md={6}>
                      <h4>Cash Flow Metrics</h4>
                      <h6>Financing</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key="opex"
                        color="#82ca9d"
                      />
                      <h6>Years of Solvency Based on Cash Flow</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="liquidity"
                        key2="debt"
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
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="triple"
                        key1="assets"
                        key2="liabilities"
                        key3="netPosition"
                        color1="green"
                        color2="red"
                        color3="blue"
                      />
                      <h6>Years of Solvency</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="liquidity"
                        key2="opex"
                        color1="#8884d8"
                        color2="#ffc658"
                      />
                      <h6>Demand for Capital</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key="liquidity"
                        color="#ff7300"
                      />
                    </Col>
                    <Col md={6}>
                      <h4>Cash Flow Metrics</h4>
                      <h6>Financing</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="single"
                        key="opex"
                        color="#82ca9d"
                      />
                      <h6>Years of Solvency Based on Cash Flow</h6>
                      <ChartComponent
                        data={dataSets[activeKey]}
                        chartType="dual"
                        key1="liquidity"
                        key2="debt"
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
              {activeKey === 'comparison' && <Comparison data={snapshotData} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VisualizationExport;