import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const VisualizationExport = ({ clientData }) => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Placeholder data
  const data = clientData || [
    { year: 'Year 1', forecast: 400 },
    { year: 'Year 2', forecast: 800 },
    { year: 'Year 3', forecast: 1500 },
    { year: 'Year 4', forecast: 2000 },
    { year: 'Year 5', forecast: 3000 },
  ];

  useEffect(() => {
    const lineCtx = lineChartRef.current.getContext('2d');
    const barCtx = barChartRef.current.getContext('2d');
    const pieCtx = pieChartRef.current.getContext('2d');

    // Line chart
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: data.map(item => item.year),
        datasets: [{
          label: 'Forecast (Line)',
          data: data.map(item => item.forecast),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Bar chart
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.year),
        datasets: [{
          label: 'Forecast (Bar)',
          data: data.map(item => item.forecast),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Pie chart
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.year),
        datasets: [{
          label: 'Forecast (Pie)',
          data: data.map(item => item.forecast),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

  }, [data]);

  const exportToCSV = () => {
    const csvData = data.map(row => `${row.year},${row.forecast}`).join('\n');
    const csvBlob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client_forecast.csv';
    a.click();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Client Financial Projections</h2>
      <p><strong>Note:</strong> These are example graphs to test how data may be projected. Data from <code>ClientDataImport</code> reports will need to be implemented. In progress page.</p>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {/* Line chart */}
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Line Chart</h3>
          <canvas ref={lineChartRef} />
        </div>

        {/* Bar chart */}
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Bar Chart</h3>
          <canvas ref={barChartRef} />
        </div>

        {/* Pie chart */}
        <div style={{ width: '300px', height: '300px' }}>
          <h3>Pie Chart</h3>
          <canvas ref={pieChartRef} />
        </div>
      </div>

      <button onClick={exportToCSV}>Export Data as CSV</button>
    </div>
  );
};

export default VisualizationExport;
