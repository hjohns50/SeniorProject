import React from 'react';
import './TableHeader.css'

const TableHeader = ({ selectedColumns, setSelectedColumns, columnMappings, tableName, isDropdownOpen, setIsDropdownOpen }) => {
    const toggleColumnSelection = (columnKey) => {
      if (selectedColumns.includes(columnKey)) {
        setSelectedColumns(selectedColumns.filter(col => col !== columnKey));
      } else {
        setSelectedColumns([...selectedColumns, columnKey]);
      }
    };
  
    const columnKeys = Object.keys(columnMappings[tableName]).filter(key => !['column_to_exclude_1', 'column_to_exclude_2'].includes(key));
  
    const numColumns = 4;
    const numItemsPerColumn = Math.ceil(columnKeys.length / numColumns);
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push(columnKeys.filter((_, index) => index % numColumns === i));
    }
  
    return (
      <div>
        {/* Dropdown menu to select column */}
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
                      {columnMappings[tableName][columnKey] || columnKey}
                      {selectedColumns.includes(columnKey) && <span className="check-mark">&#10003;</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default TableHeader;