import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import supabase from './db.js';
import tableRoutes from './routes/genTable.js';
import predictRoutes from './routes/predict.js';
import fetch from 'node-fetch';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/genTable', tableRoutes);
app.use('/predict', predictRoutes);

function trainModels() {
  return new Promise((resolve, reject) => {
    const process = spawn('python3', ['./src/models/train_models.py']);
    
    process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Training process exited with code ${code}`));
      } else {
        resolve();
      }
    });

    process.on('error', (err) => {
      reject(new Error(`Failed to start training process: ${err.message}`));
    });
  });
}

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('batter')
      .select('player_id')
      .limit(1);

    if (error) {
      throw new Error(`Error checking Supabase connection: ${error.message}`);
    }

    console.log('Connected to Supabase');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const predictPerformance = async (playerType, playerName) => {
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerType, playerName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to predict: ${response.statusText}`);
    }

    const data = await response.json();
    return data.prediction;
  } catch (error) {
    console.error(`Failed to predict: ${error.message}`);
    return null;
  }
};

const predictForPlayers = async () => {
  const pitcherPrediction = await predictPerformance('pitcher', 'Luis Castillo');
  const batterPrediction = await predictPerformance('batter', 'Freddie Freeman');

  console.log(`Prediction for Pitcher Luis Castillo: ${pitcherPrediction}`);
  console.log(`Prediction for Batter Freddie Freeman: ${batterPrediction}`);
};

(async () => {
  try {
    await checkSupabaseConnection();
    await trainModels();

    app.listen(port, async () => {
      console.log(`API is listening on port ${port}`);

      setTimeout(async () => {
        await predictForPlayers();
      }, 2000);
    });
  } catch (error) {
    console.error(`Failed to initialize: ${error.message}`);
    process.exit(1);
  }
})();
