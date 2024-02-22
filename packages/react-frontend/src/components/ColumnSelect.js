import React from 'react';

const ColumnSelect = ({ selectedColumns, toggleColumnSelection, columnMappings, tableName }) => {
  return (
    <div>
      {/* Checkboxes to select columns */}
      {Object.keys(columnMappings[tableName] || {}).map(columnKey => (
        !['column_to_exclude_1', 'column_to_exclude_2'].includes(columnKey) &&
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