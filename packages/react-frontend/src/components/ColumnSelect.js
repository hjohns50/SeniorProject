import React from 'react';

const ColumnSelect = ({ selectedColumns, toggleColumnSelection, columnMappings, tableName }) => {
  return (
    <div>
      {Object.keys(columnMappings[tableName] || {}).map(columnKey => (
        <label key={columnKey}>
          <input
            type="checkbox"
            checked={selectedColumns.includes(columnKey)}
            onChange={() => toggleColumnSelection(columnKey)}
          />
          {columnMappings[tableName][columnKey] || columnKey}
        </label>
      ))}
    </div>
  );
};

export default ColumnSelect;