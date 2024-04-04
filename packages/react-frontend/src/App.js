import './App.css';
import React, { useState } from 'react';
import Table from './components/Table';

function App() {
  const [currentTable, setCurrentTable] = useState("batter");

  const handleTableToggle = (tableName) => {
    setCurrentTable(tableName);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => handleTableToggle("batter")}>Batters</button>
        <button onClick={() => handleTableToggle("pitcher")}>Pitchers</button>

        <Table tableName={currentTable}/>
      </header>
    </div>
  );
}

export default App;
