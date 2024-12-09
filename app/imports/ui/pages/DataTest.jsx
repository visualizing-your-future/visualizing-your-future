import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { PAGE_IDS } from '../utilities/PageIDs';

const DataTest = () => {
  const [sheetData, setSheetData] = useState([]);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError('No file selected. Please upload a file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Get the specific sheet by name
      const sheetName = 'Audited Balance Sheet Input';
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        setError(`Sheet "${sheetName}" not found in the uploaded file.`);
        setSheetData([]);
        return;
      }

      // Convert the sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setSheetData(jsonData);
      setError('');
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Container className="py-3" id={PAGE_IDS.DATA_TEST}>
      <Row className="justify-content-center">
        <Col xs={8} className="text-center">
          <h2>
            <p>Upload and View Excel Data</p>
          </h2>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {sheetData.length > 0 && (
            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <h3>Sheet Data:</h3>
              <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {Object.keys(sheetData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheetData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DataTest;
