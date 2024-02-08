import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Table from './components/Table';

function App() {
  const [currentTable, setCurrentTable] = useState("batterBasic");

  const handleTableToggle = (tableName) => {
    setCurrentTable(tableName);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => handleTableToggle("batterBasic")}>Batter Basic</button>
        <button onClick={() => handleTableToggle("batterStatcast")}>Batter Statcast</button>
        {/* Add more buttons or a dropdown menu for additional tables */}

        <Table tableName={currentTable}/>
      </header>
    </div>
  );
}

export default App;