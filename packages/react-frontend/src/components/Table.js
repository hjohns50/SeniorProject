import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination } from 'react-table';
import './Table.css';
import { columnMappings, tableMappings } from '../columnMappings';
import TableHeader from './TableHeader';

const Table = ({ tableName, onSelectPlayer }) => {
  const [originalTableData, setOriginalTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(['Player', 'year', 'Team', 'Pos', 'player_age', 'batting_avg', 'b_rbi', 'hit', 'home_run', 'composite_hit_metric', 'composite_pitcher_metric']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/genTable/${tableName}`);
        console.log('Supabase Response:', response.data);

        if (response.data && response.data.data) {
          setOriginalTableData(response.data.data);
          setTableData(response.data.data);

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

  const handleUpdateColumns = () => {
    console.log("Selected Columns:", selectedColumns);
    setIsDropdownOpen(false); 
  };

  const clearFilter = () => {
    setTableData(originalTableData); 
    setSearchQuery(''); 
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
        .filter(key => !['player_id'].includes(key))
        .filter(key => selectedColumns.includes(key))
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
          },
          Cell: ({ value }) => {
            if (typeof value === 'number' && value % 1 !== 0) {
              return value.toFixed(3); 
            }
            return value;
          }
        }));
    }
    return [];
  }, [tableData, tableName, selectedColumns]);

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
    { columns, data: filteredData, initialState: { pageSize: 15 } },
    useSortBy,
    usePagination
  );

  const handleRowClick = (row) => {
    setSelectedRow(row);
    onSelectPlayer(row.original); 
  };

  return (
    <div>
      <h2>{tableMappings[tableName] || tableName}</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <TableHeader
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        columnMappings={columnMappings}
        tableName={tableName}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        tableData={tableData}
        updateTableData={setTableData}
        originalTableData={originalTableData}
        clearFilter={clearFilter}
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
              <tr
                {...row.getRowProps()}
                onClick={() => handleRowClick(row)}
                style={{
                  backgroundColor: selectedRow === row ? '#f0f0f0' : 'white',
                }}
              >
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
