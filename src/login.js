// Yeung Chin To 22084296D,WANG Haoyu 22102084D
import express from 'express';
import multer from 'multer';
import { init_userdb, validate_user, fetch_user, update_user, username_exist, update_user_image } from './userdb.js';

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
                email: user.email,
                userimg: user.userimg
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
                    email: user.email,
                    userimg: user.userimg
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

route.post('/updateProfile', form.none(), async (req, res) => {
    if (!req.session.logged) {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized"
        });
    }

    const { userid, email, password, nickname, gender, birthdate, userimg } = req.body;

    // 验证必填字段
    if (!userid || !email) {
        return res.status(400).json({
            status: "failed",
            message: "Missing required fields"
        });
    }

    try {
        // 获取当前用户信息
        const currentUser = await fetch_user(req.session.userid);
        
        // 如果没有提供新密码，使用当前密码
        const updatedPassword = password || currentUser.password;

        const success = await update_user(
            userid, 
            updatedPassword, 
            nickname || currentUser.nickname, 
            email, 
            gender || currentUser.gender, 
            birthdate || currentUser.birthdate, 
            currentUser.role, 
            currentUser.enabled, 
            userimg || currentUser.userimg
        );

        if (success) {
            req.session.email = email;
            return res.json({
                status: "success",
                message: "Profile updated successfully"
            });
        } else {
            return res.status(500).json({
                status: "failed",
                message: "Failed to update profile"
            });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            status: "failed",
            message: "An error occurred while updating the profile"
        });
    }
});


route.post('/updateUserImage', async (req, res) => {
    if (!req.session.logged) {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized"
        });
    }

    const { userimg } = req.body;

    if (!userimg) {
        return res.status(400).json({
            status: "failed",
            message: "Missing userimg"
        });
    }

    try {
        const success = await update_user_image(req.session.userid, userimg);
        if (success) {
            return res.json({
                status: "success",
                message: "User image updated successfully"
            });
        } else {
            return res.status(500).json({
                status: "failed",
                message: "Failed to update user image"
            });
        }
    } catch (error) {
        console.error('Error updating user image:', error);
        return res.status(500).json({
            status: "failed",
            message: "An error occurred while updating the user image"
        });
    }
});

export default route;