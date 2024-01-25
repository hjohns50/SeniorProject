import express from "express";
import cors from "cors";
import supabase from './db.js';
import tableRoutes from './routes/table.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/genTable', tableRoutes);

(async () => {
    try {
      const { data, error } = await supabase
        .from('batterBasic')
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
    })();
app.listen(port, () => {
    console.log(`API is listening on port ${port}`);
  });
  