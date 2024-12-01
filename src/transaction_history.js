import express from 'express';
import { fetch_history } from './tran_db.js';

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const { userId, spaceId } = req.query;
    const history = await fetch_history(userId, spaceId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
