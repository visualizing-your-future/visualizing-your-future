import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';
import * as XLSX from 'xlsx';

/** FileInput for users uploading excel file to system. */
const FileInput = ({ onDataLoad }) => {
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [workbook, setWorkbook] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [data, setData] = useState([]);
  // const [jsonText, setJsonText] = useState(''); // State for JSON text display

  // const formRef = useRef(); // To reset the form after submission
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
    // setJsonText(JSON.stringify(jsonData, null, null)); // Print the JSON file as text
    setData(jsonData);
    onDataLoad(jsonData);
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
            <h3>Import file</h3>
            <input type="file" accept=".xlsm, .xslx" onChange={handleFileChange} />
          </Col>
          <Col>
            {fileSelected && (
              <>
                <h3>Select sheet</h3>
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

// For optional prop with default value
FileInput.propTypes = {
  onDataLoad: PropTypes.func,
};

FileInput.defaultProps = {
  onDataLoad: () => {}, // Default empty function
};

export default FileInput;
