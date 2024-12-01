import express from 'express';
import { fetch_history } from './trandb.js';

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
      const { userId, spaceId } = req.query;
      console.log('Received query:', { userId, spaceId });
      const history = await fetch_history(userId, spaceId);
      console.log('Fetched history:', history);
      res.json(history);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

export default router;
