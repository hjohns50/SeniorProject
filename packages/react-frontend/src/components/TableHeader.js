import React, { useState } from 'react';
import './TableHeader.css';
import Filter from './Filter';

const TableHeader = ({ selectedColumns, setSelectedColumns, columnMappings, tableName, isDropdownOpen, setIsDropdownOpen, tableData, updateTableData, clearFilter }) => {
    const [filters, setFilters] = useState([]);

    const toggleColumnSelection = (columnKey) => {
      if (selectedColumns.includes(columnKey)) {
        setSelectedColumns(selectedColumns.filter(col => col !== columnKey));
      } else {
        setSelectedColumns([...selectedColumns, columnKey]);
      }
    };

    const applyFilter = (selectedStat, filterType, numericValue) => {
      return tableData.filter(row => {
        const rowValue = row[selectedStat];
        if (filterType === 'less') {
          return rowValue < numericValue;
        } else {
          return rowValue > numericValue;
        }
      });
    };
    
    const handleAddFilter = () => {
      setFilters([...filters, {}]);
    };

    const handleClearFilter = (index) => {
      clearFilter();
      const remainingFilters = filters.filter((_, i) => i !== index);
      setFilters(remainingFilters);
    };

    const columnKeys = Object.keys(columnMappings[tableName] || {}).filter(key => !['column_to_exclude_1', 'column_to_exclude_2'].includes(key));
  
    const numColumns = 4;
    const numItemsPerColumn = Math.ceil(columnKeys.length / numColumns);
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push(columnKeys.filter((_, index) => index % numColumns === i));
    }
  
    return (
      <div>
        <div className="table-header">
          <div
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Select Columns
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {columns.map((columnGroup, index) => (
                <div key={index} className="dropdown-column">
                  {columnGroup.map(columnKey => (
                    <div 
                      key={columnKey}
                      onMouseDown={() => toggleColumnSelection(columnKey)}
                      className={selectedColumns.includes(columnKey) ? 'dropdown-item selected' : 'dropdown-item'}
                    >
                      {columnMappings[tableName] && columnMappings[tableName][columnKey] ? columnMappings[tableName][columnKey] : columnKey}
                      {selectedColumns.includes(columnKey) && <span className="check-mark">&#10003;</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <button onClick={handleAddFilter}>Add Filter</button>
          {filters.map((filter, index) => (
            <Filter
              key={index}
              statistics={columnKeys}
              applyFilter={(selectedStat, filterType, numericValue) => {
                const filteredData = tableData.filter(row => {
                  const rowValue = row[selectedStat];
                  if (filterType === 'less') {
                    return rowValue < numericValue;
                  } else {
                    return rowValue > numericValue;
                  }
                });
                updateTableData(filteredData);
              }}
              clearFilter={() => handleClearFilter(index)}
              columnMappings={columnMappings}
            />
          ))}
        </div>
      </div>
    );
};

export default TableHeader;