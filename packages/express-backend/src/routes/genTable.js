import express from 'express';
import supabase from '../db.js';

const router = express.Router();

router.get('/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    let { data: table, error } = await supabase.from(tableName).select('*');

    const columns = Object.keys(table[0]);

    const responseData = {
      columns,
      data: table,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;