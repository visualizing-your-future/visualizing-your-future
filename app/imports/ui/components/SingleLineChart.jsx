import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const yAxisTickFormatter = (value) => `$${(value / 1_000_000).toFixed(1)} M`;

const SingleLineChart = ({ data, key, color }) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis tickFormatter={yAxisTickFormatter} />
      <Tooltip formatter={(value) => currencyFormatter(value)} />
      <Legend />
      <Line type="monotone" dataKey={key} stroke={color} activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);

export default SingleLineChart;