import React, { useState } from 'react';
import { Card, Form, Button, Table } from 'react-bootstrap';
import DualLineChart from './DualLineChart';
import SingleLineChart from './SingleLineChart';
const yAxisTickFormatter = (value) => `$${(value / 1_000_000).toFixed(1)} M`;
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

  const filteredData = data.filter((entry) => selectedYears.includes(entry.year));

  return (
    <Card.Body>
      <h5>Select Years to Compare</h5>
      <Form>
        <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
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
        <div style={{ marginTop: '40px', height: '110%' }}>
          <DualLineChart data={filteredData} key1={selectedMetric1} key2={selectedMetric2} color1="#8884d8" color2="#82ca9d" />
        </div>
      )}
    </Card.Body>
  );
};

export default Comparison;
