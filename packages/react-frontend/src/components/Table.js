import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import './Table.css';
import { columnMappings, tableMappings } from '../columnMappings';

const Table = ({ tableName }) => {
  const [tableData, setTableData] = useState([]);
  const tableColumnMapping = columnMappings[tableName] || {};
  
  const columns = useMemo(() => {
    if (tableData.length > 0) {
      return Object.keys(tableData[0])
        .filter(key => key !== 'player_id') // Exclude 'player_id'
        .map(key => ({
          Header: tableColumnMapping[key] || key,
          accessor: key,
        }));
    }
    return [];
  }, [tableData, tableColumnMapping]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/genTable/${tableName}`);
        console.log('Supabase Response:', response.data);

        if (response.data && response.data.data) {
          setTableData(response.data.data);
        } else {
          console.error('Data is null or undefined.');
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchData();
  }, [tableName]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: tableData });

  return (
    <div>
      <h2>{tableMappings[tableName] || tableName}</h2>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
