//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import express from 'express';
import { fetch_history, delete_transaction } from './trandb.js';
import { ObjectId } from 'mongodb';

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
  
router.get('/check-availability', async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    const history = await fetch_history();
    const conflictingBookings = history.filter(booking => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    const requestStart = new Date(startTime);
    const requestEnd = new Date(endTime);
    return (bookingStart < requestEnd && bookingEnd > requestStart);
    });
    res.json(conflictingBookings.map(booking => booking.spaceId));
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
  try {
      const transactionId = req.params.id;
      console.log('Attempting to delete transaction with ID:', transactionId);
      const result = await delete_transaction(transactionId);
      if (result) {
          res.json({ success: true });
      } else {
          res.status(404).json({ success: false, error: 'Transaction not found' });
      }
  } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;