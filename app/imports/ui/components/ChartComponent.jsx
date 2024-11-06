// ChartComponent.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Currency formatter
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format;

// Y-axis tick formatter for displaying values in millions
const yAxisTickFormatter = (value) => `$${(value / 1_000_000).toFixed(1)} M`;

const ChartComponent = ({ data, chartType, key1, key2, key3, color1, color2, color3 }) => {
  const renderChart = () => {
    if (chartType === 'dual') {
      return (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={yAxisTickFormatter} />
          <Tooltip formatter={(value) => currencyFormatter(value)} />
          <Legend />
          <Line type="monotone" dataKey={key1} stroke={color1} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey={key2} stroke={color2} activeDot={{ r: 8 }} />
        </LineChart>
      );
    } else if (chartType === 'triple') {
      return (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={yAxisTickFormatter} />
          <Tooltip formatter={(value) => currencyFormatter(value)} />
          <Legend />
          <Line type="monotone" dataKey={key1} stroke={color1} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey={key2} stroke={color2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey={key3} stroke={color3} activeDot={{ r: 8 }} />
        </LineChart>
      );
    } else {
      return (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={yAxisTickFormatter} />
          <Tooltip formatter={(value) => currencyFormatter(value)} />
          <Legend />
          <Line type="monotone" dataKey={key1} stroke={color1} activeDot={{ r: 8 }} />
        </LineChart>
      );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default ChartComponent;
