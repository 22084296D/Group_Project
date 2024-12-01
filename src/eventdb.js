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

async function fetch_events(eventId) {
    try {
        const events = client.db('parkingdb').collection('events');
        let query = {};
        if (eventId) query.id = eventId;
        const eventList = await events.find(query).toArray();

        return eventList.map(event => ({
            id: event.id,
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

async function delete_event(eventId) {
    try {
        const events = client.db('parkingdb').collection('events');
        const result = await events.deleteOne({ id: eventId });

        if (result.deletedCount === 1) {
            console.log(`Successfully deleted event with id ${eventId}`);
            return true;
        } else {
            console.log(`No event found with id ${eventId}`);
            return false;
        }
    } catch (err) {
        console.error('Error deleting event:', err);
        return false;
    }
}

export { init_eventdb, create_event, fetch_events, delete_event };


