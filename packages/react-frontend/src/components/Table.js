import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import './Table.css';
import { columnMappings, tableMappings } from '../columnMappings';

const Table = ({ tableName }) => {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/genTable/${tableName}`);
        console.log('Supabase Response:', response.data);
  
        if (response.data && response.data.data) {
          setTableData(response.data.data);
          
          // Log the size of the response payload
          console.log('Response Size:', JSON.stringify(response.data).length);
        } else {
          console.error('Data is null or undefined.');
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };
  
    fetchData();
  }, [tableName]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      return Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [tableData, searchQuery]);

  const columns = useMemo(() => {
    const tableColumnMapping = columnMappings[tableName] || {};
  
    if (tableData.length > 0) {
      return Object.keys(tableData[0])
        .filter(key => key !== 'player_id')
        .map(key => ({
          Header: tableColumnMapping[key] || key,
          accessor: key,
          sortDescFirst: true,
          sortType: (rowA, rowB, columnId) => {
            const valueA = rowA.values[columnId];
            const valueB = rowB.values[columnId];
  
            const isNumeric = !isNaN(parseFloat(valueA)) && !isNaN(parseFloat(valueB));
            if (isNumeric) {
              return parseFloat(valueA) - parseFloat(valueB);
            }
  
            return valueA.localeCompare(valueB);
          }
        }));
    }
    return [];
  }, [tableData, tableName]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    canPreviousPage,
    nextPage,
    canNextPage,
    pageCount,
  } = useTable(
    { columns, data: filteredData, initialState: { pageSize: 25 } },
    useSortBy,
    usePagination
  );

  return (
    <div>
      <h2>{tableMappings[tableName] || tableName}</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <table {...getTableProps()} className="styled-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : ''}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
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
      <div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {Math.ceil(filteredData.length / pageSize)}
          </strong>{' '}
        </span>
        <button onClick={() => gotoPage(0)} disabled={pageIndex === 0}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={pageIndex === pageCount - 1}>
          {'>>'}
        </button>{' '}
      </div>
    </div>
  );
};

export default Table;
