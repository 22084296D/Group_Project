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

async function fetch_users() {
    try {
        const usersCollection = client.db('parkingdb').collection('users');
        return await usersCollection.find({}, {
            projection: { _id: 0, userid: 1, nickname: 1, email: 1, gender: 1, birthdate: 1, role: 1 }
        }).toArray();
    } catch (err) {
        console.error('Unable to fetch users from database!', err);
        return [];
    }
}

async function username_exist(userid) {
    try {
        const user = await fetch_users(userid);
        return user !== null;
    } catch (err) {
        console.error('Unable to fetch from database!', err);
        return false;
    }
}

async function update_user(userid, password, nickname, email, gender, birthdate, role = 'user', enabled = true, userimg = null) {
    const usersCollection = client.db('parkingdb').collection('users');

    const userData = { 
        userid: userid,
        password: password,
        nickname: nickname,
        email: email,
        gender: gender,
        birthdate: birthdate,
        role: role,
        enabled: enabled,
    };

    if (userimg) {
        userData.userimg = userimg;
    }

    try {
        const result = await usersCollection.updateOne(
            { userid: userid },
            { $set: userData },
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

async function update_user_image(userid, userimg) {
    const usersCollection = client.db('parkingdb').collection('users');

    try {
        const result = await usersCollection.updateOne(
            { userid: userid },
            { $set: { userimg: userimg } }
        );

        if (result.modifiedCount > 0) {
            console.log('Updated user image');
            return true;
        } else {
            console.log('No changes made to user image');
            return false;
        }
    } catch (err) {
        console.error('Unable to update user image in the database!', err);
        return false;
    }
}

async function create_user(user) {
    try {
        const usersCollection = client.db('parkingdb').collection('users');
        const result = await usersCollection.insertOne(user);
        if (result.insertedId) {
            console.log('Added 1 user');
            return true;
        }
        console.log('Failed to add user');
        return false;
    } catch (err) {
        console.error('Error adding user:', err);
        return false;
    }
}

async function delete_user(userid) {
    try {
        const usersCollection = client.db('parkingdb').collection('users');
        const result = await usersCollection.deleteOne({ userid: userid });
        if (result.deletedCount === 1) {
            console.log(`Successfully deleted user ${userid}`);
            return true;
        }
        console.log(`No user found with id ${userid}`);
        return false;
    } catch (err) {
        console.error('Error deleting user:', err);
        return false;
    }
}

export { init_userdb, validate_user, fetch_users, update_user, username_exist, update_user_image, create_user, delete_user };

init_userdb().catch(console.dir);