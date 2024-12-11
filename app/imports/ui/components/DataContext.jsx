import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sheetData, setSheetData] = useState([]);

  return (
    <DataContext.Provider value={{ sheetData, setSheetData }}>
      {children}
    </DataContext.Provider>
  );
};
