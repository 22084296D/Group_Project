//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import express from 'express';
import multer from 'multer';
import { fetch_events, delete_event, create_event } from './eventdb.js';

const route = express.Router();
const form = multer();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.get('/all', async (req, res) => {
    try {
        const events = await fetch_events();
        res.json(events);
    } catch (error) {
        console.error('Error in /event/all route:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


route.post('/create', form.none(), async (req, res) => {
    const eventDetails = {
        title: req.body.title,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        description: req.body.description,
        venue: req.body.venue
    };
    const result = await create_event(eventDetails);
    if (result) {
        res.json({ success: true, message: 'Event created successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to create event' });
    }
});

// 删除事件
route.delete('/delete/:id', async (req, res) => {
    const eventId = parseInt(req.params.id);
    const result = await delete_event(eventId);
    if (result) {
        res.json({ success: true, message: 'Event deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'Event not found or could not be deleted' });
    }
});

export default route;
