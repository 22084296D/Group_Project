import express from 'express';
import { ObjectId } from 'mongodb';
import client from './dbclient.js';

const router = express.Router();

router.get('/check-availability', async (req, res) => {
    try {
        const { startTime, endTime } = req.query;
        console.log('Received check-availability request:', { startTime, endTime });

        const history = client.db('parkingdb').collection('history');
        const bookedSpaces = await history.find({
            $or: [
                { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
                { startTime: { $gte: new Date(startTime), $lt: new Date(endTime) } },
                { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } }
            ]
        }).toArray();
        console.log('Query parameters:', { startTime, endTime });
        console.log('Converted dates:', { 
            startDate: new Date(startTime), 
            endDate: new Date(endTime) 
        });
        console.log('Raw booked spaces:', bookedSpaces);
        
        console.log('Booked spaces:', bookedSpaces.map(booking => booking.spaceId));

        res.json(bookedSpaces.map(booking => booking.spaceId));
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});



router.post('/book', async (req, res) => {
    try {
        const { spaceId, startTime, endTime, userId, status } = req.body;
        const history = client.db('parkingdb').collection('history');

        const result = await history.insertOne({
            spaceId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            userId,
            status,
            timestamp: new Date()
        });

        if (result.insertedId) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, error: 'Booking failed' });
        }
    } catch (error) {
        console.error('Error booking space:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.post('/book', async (req, res) => {
    try {
        const { spaceId, startTime, endTime, userId, status } = req.body;
        const history = client.db('parkingdb').collection('history');

        const result = await history.insertOne({
            spaceId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            userId,
            status,
            timestamp: new Date()
        });

        if (result.insertedId) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, error: 'Booking failed' });
        }
    } catch (error) {
        console.error('Error booking space:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default router;