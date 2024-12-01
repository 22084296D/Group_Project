// Yeung Chin To 22084296D,WANG Haoyu 22102084D
import express from 'express';
import multer from 'multer';
import { init_userdb, validate_user, fetch_user } from './userdb.js';

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

route.get('/me', async (req, res) => {
    if (req.session.logged) {
        const user = await fetch_user(req.session.userid);
        if (user) {
            return res.json({
                status: "success",
                user: {
                    userid: user.userid,
                    role: user.role
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

export default route;