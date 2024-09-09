import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import * as XLSX from 'xlsx';

/** FileInput for users uploading excel file to system. */
const FileInput = () => {
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [workbook, setWorkbook] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsm')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const wb = XLSX.read(binaryStr, { type: 'binary', bookType: 'xlsm' });
        // Get workbook
        setWorkbook(wb);
        // Get sheet names
        const names = wb.SheetNames;
        setSheetNames(names);
        setSelectedSheet(names[0]); // Default to the first sheet
        setFileSelected(true);
      };
      reader.readAsBinaryString(file);
    }
  };

  const loadSheetData = (wb, sheetName) => {
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    setData(jsonData);
  };

  const handleSheetChange = (event) => {
    const sheetName = event.target.value;
    setSelectedSheet(sheetName);
    loadSheetData(workbook, sheetName);
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <h2>Import file</h2>
            <input type="file" accept=".xlsm, .xslx" onChange={handleFileChange} />
          </Col>
          <Col>
            {fileSelected && (
              <>
                <h2>Select sheet</h2>
                {sheetNames.length > 0 && (
                  <select onChange={handleSheetChange} value={selectedSheet}>
                    {sheetNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </Col>
        </Row>
        <Row lg={10} md={10} sm={10}>
          <Col>
            {data.length > 0 && (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                      {data[0].length > 0 && Object.keys(data[0]).map((key) => (
                        <th key={key} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                          <td key={idx} style={{ border: '1px solid #ccc', padding: '8px' }}>
                            {value}
                          </td>
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

    </div>
  );

};

export default FileInput;
