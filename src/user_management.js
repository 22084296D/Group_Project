//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import express from 'express';
import { fetch_users, create_user, delete_user } from './userdb.js';

const route = express.Router();

route.get('/all', async (req, res) => {
    try {
        const users = await fetch_users();
        res.json(users);
    } catch (error) {
        console.error('Error in /user/all route:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

route.post('/create', async (req, res) => {
    const user = {
        userid: req.body.userid,
        password: req.body.password,
        nickname: req.body.nickname,
        email: req.body.email,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        role: req.body.role
    };
    
    const result = await create_user(user);
    if (result) {
        res.json({ success: true, message: 'User created successfully' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
});

route.delete('/delete/:id', async (req, res) => {
    const userid = req.params.id;
    const result = await delete_user(userid);
    if (result) {
        res.json({ success: true, message: 'User deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found or could not be deleted' });
    }
});

export default route;