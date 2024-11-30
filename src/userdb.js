//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import fs from 'fs/promises';
import client from './dbclient.js';

async function init_db() {
    try {
        const users = client.db('parkingdb').collection('users');
        const count = await users.countDocuments();
        if (count === 0) {
            const data = await fs.readFile('users.json', 'utf-8');
            const userProfiles = JSON.parse(data);
            const result = await users.insertMany(userProfiles);
            console.log(`Added ${result.insertedCount} users`);
        }
    } catch (err) {
        console.error('Unable to initialize the database!', err);
    }
}

async function validate_user(userid, password) {
    if (!userid || !password) {
        return false;
    }

    const users = client.db('parkingdb').collection('users');

    try {
        const user = await users.findOne({ userid: userid, password: password });
        return user || false;
    } catch (err) {
        console.error('Unable to fetch from database!', err);
        return false;
    }
}

async function update_user(userid, password, role, enabled) {
    const users = client.db('parkingdb').collection('users');

    const updateData = { 
        $set: {
            password: password,
            role: role,
            enabled: enabled
        }
    };

    try {
        const result = await users.updateOne(
            { userid: userid },
            updateData,
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log('Added 1 user');
        } else {
            console.log('Updated 1 user');
        }
        return true;
    } catch (err) {
        console.error('Unable to update the database!', err);
        return false;
    }
}

async function fetch_user(userid) {
    const users = client.db('parkingdb').collection('users');

    try {
        const user = await users.findOne({ userid: userid });
        return user;
    } catch (err) {
        console.error('Unable to fetch from database!', err);
        return null;
    }
}

async function username_exist(userid) {
    try {
        const user = await fetch_user(userid);
        return user !== null;
    } catch (err) {
        console.error('Unable to fetch from database!', err);
        return false;
    }
}

init_db().catch(console.dir);