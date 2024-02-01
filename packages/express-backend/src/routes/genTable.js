import express from 'express';
import supabase from '../db.js';

const router = express.Router();

router.get('/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    let { data: batterBasic, error } = await supabase.from(tableName).select('name, year, batting_avg');

    const columns = Object.keys(batterBasic[0]);

    const responseData = {
      columns,
      data: batterBasic,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;