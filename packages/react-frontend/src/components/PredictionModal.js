import React from 'react';
import './PredictionModal.css';
const PredictionModal = ({ isOpen, prediction, onClose }) => {
  return (
    <div className={`prediction-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        {prediction ? (
          <div>
            <h2>Prediction Result</h2>
            <p>{prediction}</p>
          </div>
        ) : (
          <div className="predicting-animation">
            <p>Predicting...</p>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PredictionModal;
