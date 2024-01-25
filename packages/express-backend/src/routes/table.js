// express-backend/src/routes/table.js
import express from 'express';
import supabase from '.././db.js';

const router = express.Router();

router.get('/genTable/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    const result = await supabase.from('batterBasic').select('*').limit(100);

    const columns = Object.keys(result[0]);

    const responseData = {
      columns,
      data: result,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
