import fs from 'fs/promises';
import client from './dbclient.js';

const eventdb = client.db('parkingdb').collection('events');

async function init_eventdb() {
    try {
        const eventcount = await eventdb.countDocuments();
        if (eventcount === 0) {
            const eventData = JSON.parse(await fs.readFile('events.json', 'utf-8'));
            const result = await eventdb.insertMany(eventData);
            console.log(`Initially added ${result.insertedCount} events`);
        }
    } catch (err) {
        console.error('Unable to initialize the database!', err);
    }
}

async function getMaxEventId() {
    try {
        const result = await eventdb.aggregate([
            { $group: { _id: null, maxId: { $max: { $toInt: "$id" } } } }
        ]).toArray();
        return result.length > 0 ? result[0].maxId : 0;
    } catch (err) {
        console.error('Error finding max event id:', err);
        return 0;
    }
}

async function create_event(eventDetails) {
    try {
        const newId = ((await getMaxEventId()) + 1).toString();
        const result = await eventdb.insertOne({ ...eventDetails, id: newId, createdAt: new Date() });
        if (result.insertedId) {
            console.log('Added 1 event');
            return true;
        }
        console.log('Failed to add event');
        return false;
    } catch (err) {
        console.error('Error adding event:', err);
        return false;
    }
}

async function fetch_events(eventId) {
    try {
        const query = eventId ? { id: eventId } : {};
        return await eventdb.find(query, {
            projection: { _id: 0, id: 1, title: 1, date: 1, startTime: 1, endTime: 1, description: 1, venue: 1 }
        }).toArray();
    } catch (err) {
        console.error('Unable to fetch events from database!', err);
        return [];
    }
}

async function delete_event(eventId) {
    try {
        const result = await eventdb.deleteOne({ id: eventId });
        if (result.deletedCount === 1) {
            console.log(`Successfully deleted event with id ${eventId}`);
            return true;
        }
        console.log(`No event found with id ${eventId}`);
        return false;
    } catch (err) {
        console.error('Error deleting event:', err);
        return false;
    }
}

init_eventdb().catch(console.dir);

export { create_event, fetch_events, delete_event };
