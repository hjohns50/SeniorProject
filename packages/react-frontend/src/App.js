import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import PredictionModal from './components/PredictionModal';
import axios from 'axios';

function App() {
  const [currentTable, setCurrentTable] = useState("batter");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setPrediction(null);
    };
  }, []);

  const handleTableToggle = (tableName) => {
    setCurrentTable(tableName);
    setSelectedPlayer(null);
    setPrediction(null);
  };

  const handlePredict = async () => {
    if (selectedPlayer) {
      setLoading(true);
      setModalOpen(true);
      try {
        const response = await axios.post('http://localhost:8000/predict', {
          playerType: currentTable,
          playerName: selectedPlayer.Player,
        });
        setPrediction(response.data.prediction);
        setLoading(false);
      } catch (error) {
        console.error('Failed to predict:', error);
        setLoading(false);
      }
    }
  };

  const closeModal = () => {
    setPrediction(null);
    setModalOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => handleTableToggle("batter")}>Batters</button>
        <button onClick={() => handleTableToggle("pitcher")}>Pitchers</button>
        
        <button onClick={handlePredict} disabled={!selectedPlayer}>
          Predict
        </button>
        <PredictionModal isOpen={modalOpen} prediction={prediction} onClose={closeModal} />
        <Table tableName={currentTable} onSelectPlayer={setSelectedPlayer} />
      </header>
    </div>
  );
}

export default App;
