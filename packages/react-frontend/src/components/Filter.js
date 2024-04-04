import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';

const Filter = ({ statistics, applyFilter, clearFilter, unapplyFilter, columnMappings }) => {
  const [selectedStat, setSelectedStat] = useState('');
  const [filterType, setFilterType] = useState('less');
  const [numericValue, setNumericValue] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false); 

  const handleStatChange = (e) => {
    setSelectedStat(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleNumericValueChange = (e) => {
    setNumericValue(e.target.value);
  };

  const handleApplyFilter = () => {
    if (selectedStat && numericValue !== '') {
      applyFilter(selectedStat, filterType, parseFloat(numericValue));
      setIsFilterApplied(true); 
    } else {
      alert('Please select a statistic and enter a numeric value');
    }
  };

  useEffect(() => {
    setIsFilterApplied(false);
  }, [selectedStat, filterType, numericValue]);

  return (
    <div>
      <select value={selectedStat} onChange={handleStatChange}>
        <option value="">Select a statistic</option>
        {Object.keys(columnMappings.batter).map((key) => (
          <option key={key} value={key}>
            {columnMappings.batter[key]}
          </option>
        ))}
      </select>
      <select value={filterType} onChange={handleFilterTypeChange}>
        <option value="less">Less than</option>
        <option value="greater">Greater than</option>
      </select>
      <input
        type="number"
        value={numericValue}
        onChange={handleNumericValueChange}
        placeholder="Enter numeric value"
      />
      <button onClick={handleApplyFilter}>Apply Filter</button>
      <button onClick={clearFilter}>Clear Filter</button>
      {isFilterApplied && <FaCheck color="green" />}
    </div>
  );
};

export default Filter;