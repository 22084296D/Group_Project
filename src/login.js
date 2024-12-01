// Yeung Chin To 22084296D,WANG Haoyu 22102084D
import express from 'express';
import multer from 'multer';
import { init_userdb, validate_user, fetch_user, update_user, username_exist } from './userdb.js';

const form = multer();
const route = express.Router();

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
        req.session.email = user.email;
        req.session.logged = true;
        req.session.timestamp = Date.now();

        return res.json({
            status: "success",
            user: {
                userid: user.userid,
                role: user.role,
                email: user.email
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

route.get('/me', async (req, res) => {
    if (req.session.logged) {
        const user = await fetch_user(req.session.userid);
        if (user) {
            return res.json({
                status: "success",
                user: {
                    userid: user.userid,
                    role: user.role,
                    email: user.email
                }
            });
        } else {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }
    } else {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized"
        });
    }
});

route.post('/register', form.none(), async (req, res) => {
    await init_userdb();

    const { userid, password, nickname, email, gender, birthdate } = req.body;

    if (!userid || !password || !nickname || !email || !gender || !birthdate) {
        return res.status(400).json({ status: 'failed', message: 'All fields are required.' });
    }

    if (await username_exist(userid)) {
        return res.status(400).json({ status: 'failed', message: `User ID ${userid} already exists.` });
    }

    const success = await update_user(userid, password, 'user', true);
    if (success) {
        return res.json({
            status: 'success',
            message: 'Registration successful! You can log in now.',
            user: {
                userid: userid,
                nickname: nickname,
                email: email,
                gender: gender,
                birthdate: birthdate,
            },
        });
    } else {
        return res.status(500).json({ status: 'failed', message: 'Account created but unable to save into the database.' });
    }
});

export default route;