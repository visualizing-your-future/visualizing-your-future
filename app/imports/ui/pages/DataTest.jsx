import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Alert, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { PAGE_IDS } from '../utilities/PageIDs';

const DataInput = () => {
  // State to store the names of sheets in the Excel file
  const [sheetNames, setSheetNames] = useState([]);
  // State to store the selected sheet name
  const [selectedSheet, setSelectedSheet] = useState('');
  // State to store the data from the selected sheet
  const [sheetData, setSheetData] = useState([]);
  // State to store the column headers from the selected sheet
  const [columns, setColumns] = useState([]);
  // State to track if the table cells should be editable
  const [isEditable, setIsEditable] = useState(false);
  // State to track if the save operation was successful
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handles uploading an Excel file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('No file selected. Please upload a valid Excel file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Store sheet names to let the user select one
      setSheetNames(workbook.SheetNames);
      // Reset selection and data states
      setSelectedSheet('');
      setSheetData([]);
      setColumns([]);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handles selecting a sheet from the uploaded file
  const handleSheetSelect = (sheetName) => {
    const file = document.querySelector('input[type="file"]').files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Access the specified sheet by name
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        alert(`Sheet "${sheetName}" not found in the uploaded file.`);
        return;
      }

      // Parse the worksheet data into a 2D array
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setColumns(jsonData[0]); // First row contains column headers
      setSheetData(
        jsonData.slice(1).map((row) => row.map((cell) => (typeof cell === 'number' ? Math.abs(cell) : cell))),
      ); // Ensure numeric values are positive
      setSelectedSheet(sheetName);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handles changes in individual table cells (used when editing is enabled)
  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedData = [...sheetData];
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, '')); // Strip non-numeric characters
    updatedData[rowIndex][colIndex] = Number.isNaN(numericValue) ? value : Math.abs(numericValue); // Ensure positive
    setSheetData(updatedData);
  };

  // Formats cell values, adding $ for numeric values
  const formatCell = (cell) => {
    if (typeof cell === 'number') {
      return `$${cell.toLocaleString()}`; // Add $ and format with commas
    }
    return cell;
  };

  // Saves changes made to the data and shows a success message
  const saveChanges = () => {
    console.log('Saved Data:', sheetData);
    setSaveSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Exports the current data into a new Excel file
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [columns, ...sheetData]; // Combine headers and data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Convert to worksheet format
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedSheet || 'Sheet1');
    XLSX.writeFile(workbook, 'EditedData.xlsx'); // Save as file
  };

  return (
    <Container id={PAGE_IDS.DATA_INPUT} className="py-3">
      {/* Upload and Sheet Selection Section */}
      <Row className="justify-content-between align-items-center mb-3">
        {/* File upload */}
        <Col md={4}>
          <Form.Group>
            <Form.Label>Upload Excel File:</Form.Label>
            <Form.Control type="file" accept=".xlsx, .xls, .xlsm, .csv" onChange={handleFileUpload} />
          </Form.Group>
        </Col>
        {/* Sheet selection dropdown */}
        <Col md={4}>
          {sheetNames.length > 0 && (
            <Form.Group>
              <Form.Label>Select a Sheet:</Form.Label>
              <Form.Control
                as="select"
                value={selectedSheet}
                onChange={(e) => handleSheetSelect(e.target.value)}
              >
                <option value="">-- Select a Sheet --</option>
                {sheetNames.map((sheetName, index) => (
                  <option key={index} value={sheetName}>
                    {sheetName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
        </Col>
        {/* Enable editing checkbox */}
        <Col md={4} className="d-flex align-items-center justify-content-center">
          <Form.Check
            type="checkbox"
            label="Enable Editing"
            className="mt-4"
            checked={isEditable}
            onChange={(e) => setIsEditable(e.target.checked)}
            style={{
              transform: 'scale(1.2)', // Scale up checkbox size
              marginRight: '5px', // Add spacing between checkbox and label
            }}
          />
        </Col>
      </Row>
      {/* Table Display Section */}
      {sheetData.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>
                Data from: {selectedSheet}
              </Card.Header>
              <Card.Body>
                <div style={{ overflowX: 'auto' }}>
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        {columns.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheetData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>
                              {isEditable ? (
                                <Form.Control
                                  type="text"
                                  value={formatCell(cell)}
                                  onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                  style={{ fontSize: '0.9rem' }}
                                />
                              ) : (
                                <span>{formatCell(cell)}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {/* Save and Export Buttons */}
                {isEditable && (
                  <>
                    <Button variant="success" onClick={saveChanges} className="mt-3 me-2">
                      Save Changes
                    </Button>
                    <Button variant="primary" onClick={exportToExcel} className="mt-3">
                      Export to Excel
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      {/* Success Alert */}
      {saveSuccess && (
        <Alert variant="success" className="mt-3">
          Data saved successfully!
        </Alert>
      )}
    </Container>
  );
};

export default DataInput;
