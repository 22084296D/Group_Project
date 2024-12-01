//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import express from 'express';
import multer from 'multer';
import { promises as fs } from 'fs';

const form = multer();
const users = new Map();
const route = express.Router();

async function init_userdb() {
    if (users.size > 0) return;

    try {
        const data = await fs.readFile('users.json', 'utf-8');
        const parsedUsers = JSON.parse(data);
        parsedUsers.forEach(user => {
            users.set(user.userid, user); 
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function validate_user(userid, password) {
    const user = users.get(userid);
    
    if (!user || user.password !== password) {
        return false;
    }

    return {
        userid: user.userid,
        role: user.role,
        enabled: user.enabled
    };
}

route.post('/login', form.none(), async (req, res) => {
    await init_userdb();

    if (req.session.logged) {
        req.session.logged = false;
    }

    const { userid, password } = req.body;
    const user = await validate_user(userid, password); 

    if (user) {
        if (!user.enabled) {
            return res.status(401).json({
                status: "failed",
                message: `User ${userid} is currently disabled`
            });
        }

        req.session.userid = user.userid;
        req.session.role = user.role;
        req.session.logged = true;
        req.session.timestamp = Date.now();

        return res.json({
            status: "success",
            user: {
                userid: user.userid,
                role: user.role,
            }
        });
    } else {
        return res.status(401).json({
            status: "failed",
            message: "Incorrect userid and password"
        });
    }
});

route.post('/logout', (req, res) => {
    if (req.session.logged) {
        req.session.destroy();
        return res.end();
    } else {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized"
        });
    }
});

route.get('/me', (req, res) => {
    if (req.session.logged) {
        const user = users.get(req.session.userid);
        return res.json({
            status: "success",
            user: {
                userid: user.userid,
                role: user.role
            }
        });
    } else {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized"
        });
    }
});

export default route;