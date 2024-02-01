// react-frontend/src/components/Table.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Table = ({ tableName }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/genTable/${tableName}`);
        console.log('Supabase Response:', response.data);
        setTableData(response.data.data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchData();
  }, [tableName]);

  return (
    <div>
      <h2>{tableName} Table</h2>
      <table>
        <thead>
          <tr>
            {tableData.length > 0 &&
              Object.keys(tableData[0]).map((column) => <th key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((column, cellIndex) => (
                <td key={cellIndex}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
