import fs from 'fs/promises';
import client from './dbclient.js';

async function init_eventdb() {
    try {
        const event = client.db('parkingdb').collection('events');
        const eventcount = await event.countDocuments();

        if (eventcount === 0) {
            const readeventdata = await fs.readFile('events.json', 'utf-8');
            const eventData = JSON.parse(readeventdata);
            const result = await event.insertMany(eventData);
            console.log(`Initially added ${result.insertedCount} events`);
        }
    } catch (err) {
        console.error('Unable to initialize the database!', err);
    }
}
init_eventdb().catch(console.dir);

async function create_event(eventDetails) {
    try {
        const events = client.db('parkingdb').collection('events');
        const result = await events.insertOne({
            ...eventDetails,
            createdAt: new Date()
        });

        if (result.insertedId) {
            console.log('Added 1 event');
            return true;
        } else {
            console.log('Failed to add event');
            return false;
        }
    } catch (err) {
        console.error('Error adding event:', err);
        return false;
    }
}

async function fetch_events(searchQuery = '') {
    try {
        const events = client.db('parkingdb').collection('events');
        let query = {};
        if (searchQuery) {
            query = { $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { venue: { $regex: searchQuery, $options: 'i' } }
            ]};
        }
        const eventsList = await events.find(query).toArray();

        return eventsList.map(event => ({
            id: event._id,
            title: event.title,
            dateTime: event.dateTime,
            description: event.description,
            venue: event.venue
        }));
    } catch (err) {
        console.error('Unable to fetch events from database!', err);
        return [];
    }
}

export { init_eventdb, create_event, fetch_events };


