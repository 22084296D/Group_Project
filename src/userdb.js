// Yeung Chin To 22084296D, WANG Haoyu 22102084D
import fs from 'fs/promises';
import client from './dbclient.js';

const users = new Map();

async function init_userdb() {
    if (users.size > 0) {
        return;
    }

    try {
        const usersCollection = client.db('parkingdb').collection('users');
        const count = await usersCollection.countDocuments();

        if (count === 0) {
            const data = await fs.readFile('users.json', 'utf-8');
            const userProfiles = JSON.parse(data);
            const result = await usersCollection.insertMany(userProfiles);
            console.log(`Added ${result.insertedCount} users`);
        }

        const data = await fs.readFile('users.json', 'utf-8');
        const parsedUsers = JSON.parse(data);
        parsedUsers.forEach(user => {
            users.set(user.userid, user);
        });

    } catch (error) {
        console.error('Error initializing the database:', error);
    }
}

async function validate_user(userid, password) {
    if (!userid || !password) {
        return false;
    }

    const usersCollection = client.db('parkingdb').collection('users');

    try {
        const user = await usersCollection.findOne({ userid: userid, password: password });
        return user || false;
    } catch (err) {
        console.error('Unable to fetch from database!', err);
        return false;
    }
}

async function update_user(userid, password, role, enabled) {
    const usersCollection = client.db('parkingdb').collection('users');

    const updateData = { 
        $set: {
            password: password,
            role: role,
            enabled: enabled
        }
    };

    try {
        const result = await usersCollection.updateOne(
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
    const usersCollection = client.db('parkingdb').collection('users');

    try {
        const user = await usersCollection.findOne({ userid: userid });
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

export { init_userdb, validate_user, fetch_user, update_user, username_exist };

init_userdb().catch(console.dir);