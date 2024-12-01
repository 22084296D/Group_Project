// Yeung Chin To 22084296D, WANG Haoyu 22102084D
import express from 'express';
import { fetch_history } from './trandb.js';

const route = express.Router();

route.get('/api/transaction-history', async (req, res) => {
    try {
        const history = await fetch_history();
        res.json({
            status: "success",
            data: history
        });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ 
            status: "failed", 
            message: "Internal Server Error: " + error.message
        });
    }
});

export default route;
