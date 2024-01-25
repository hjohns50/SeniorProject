import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Table = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/genTable/batterBasic') 
      .then(response => {
        setTableData(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching table data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Your Table</h2>
      <table>
        <thead>
          <tr>
            {tableData.length > 0 && Object.keys(tableData[0]).map(column => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;