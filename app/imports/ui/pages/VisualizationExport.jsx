import React from 'react';
import { Col, Container, Row, Card, CardHeader } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PAGE_IDS } from '../utilities/PageIDs';

// Formatter for currency
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0, // Adjust if you want decimal places
}).format;

// Financial Data for visualization
const VisualizationExport = () => {
  // Hard code data for example
  const data = [
    {
      name: 'Year 6',
      netPosition: 533192165,
      cashInflow: 36140210,
      cashOutflow: 35860815,
      netCashFlow: 279395,
      liquidity: 369418004,
      opex: 35860815,
      debt: 72700000,
    },
    {
      name: 'Year 7',
      netPosition: 561522031,
      cashInflow: 36587523,
      cashOutflow: 34998259,
      netCashFlow: 1589264,
      liquidity: 403370308,
      opex: 34998259,
      debt: 69700000,
    },
    {
      name: 'Year 8',
      netPosition: 548326762,
      cashInflow: 35693705,
      cashOutflow: 36110120,
      netCashFlow: -416415,
      liquidity: 422605819,
      opex: 35603263,
      debt: 66193143,
    },
    {
      name: 'Year 9',
      netPosition: 581109400,
      cashInflow: 35567019,
      cashOutflow: 36521628,
      netCashFlow: -954609,
      liquidity: 432669418,
      opex: 36014771,
      debt: 41686286,
    },
    {
      name: 'Pro 1',
      netPosition: 574544776,
      cashInflow: 35914282,
      cashOutflow: 37310350,
      netCashFlow: -1396068,
      liquidity: 428237517,
      opex: 36803493,
      debt: 41179429,
    },
  ];

  return (
    <Container id={PAGE_IDS.VISUALIZATION_EXPORT}>
      <Row>
        <Col>
          <h3>Equity Metrics</h3>
          <Card>
            <CardHeader>Net Position</CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={600}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => currencyFormatter(value)} fontSize={10} />
                <Tooltip formatter={(value) => currencyFormatter(value)} />
                <Legend />
                <Line type="monotone" dataKey="netPosition" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>

            <CardHeader>Liquidity</CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={600}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => currencyFormatter(value)} fontSize={10} />
                <Tooltip formatter={(value) => currencyFormatter(value)} />
                <Legend />
                <Line type="monotone" dataKey="liquidity" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>

            <CardHeader>Debt</CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={600}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => currencyFormatter(value)} fontSize={10} />
                <Tooltip formatter={(value) => currencyFormatter(value)} />
                <Legend />
                <Line type="monotone" dataKey="debt" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col>
          <h3>Cash Flow Metrics</h3>
          <Card>
            <CardHeader>Cash Inflow and Outflow</CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={600}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => currencyFormatter(value)} fontSize={10} />
                <Tooltip formatter={(value) => currencyFormatter(value)} />
                <Legend />
                <Line type="monotone" dataKey="cashInflow" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="cashOutflow" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>

            <CardHeader>Net Cash Flow</CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => currencyFormatter(value)} fontSize={10} />
                <Tooltip formatter={(value) => currencyFormatter(value)} />
                <Legend />
                <Line type="monotone" dataKey="netCashFlow" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>

            <CardHeader>Operating Expenses (Opex)</CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={600}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => currencyFormatter(value)} fontSize={10} />
                <Tooltip formatter={(value) => currencyFormatter(value)} />
                <Legend />
                <Line type="monotone" dataKey="opex" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VisualizationExport;
