import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

function predictPerformance(playerType, playerName) {
  return new Promise((resolve, reject) => {
    const process = spawn('python3', ['./src/models/predict.py', playerType, playerName]);

    let result = '';
    process.stdout.on('data', (data) => {
      result += data.toString();
    });

    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Prediction process exited with code ${code}`));
      } else {
        resolve(result.trim());
      }
    });

    process.on('error', (err) => {
      reject(new Error(`Failed to start prediction process: ${err.message}`));
    });
  });
}

router.post('/', async (req, res) => {
  const { playerType, playerName } = req.body;

  if (!playerType || !playerName) {
    return res.status(400).send('Missing playerType or playerName in request body');
  }

  try {
    const prediction = await predictPerformance(playerType, playerName);
    res.json({ playerType, playerName, prediction });
  } catch (error) {
    res.status(500).send(`Failed to predict: ${error.message}`);
  }
});

export default router;
