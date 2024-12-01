//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { init_historydb, update_history, fetch_history } from './trandb.js';

const route = express.Router();
const form = multer();

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.post('/process', async (req, res) => {
    try {
        const { cardNumber, cardName, expiryDate, cvv, bookingDetails } = req.body;

        // 这里应该有实际的支付处理逻辑
        // 为了演示，我们假设支付总是成功的
        const paymentSuccessful = true;

        if (paymentSuccessful) {
            // 准备交易详情
            const transactionDetails = {
                userId: bookingDetails.user,
                spaceId: bookingDetails.spaceId,
                startTime: new Date(bookingDetails.startTime),
                endTime: new Date(bookingDetails.endTime),
                totalCost: parseFloat(bookingDetails.totalCost),
                paymentMethod: 'Credit Card',
                lastFourDigits: cardNumber.slice(-4),
                status: 'Confirmed'
            };

            // 更新历史记录
            const updateResult = await update_history(transactionDetails);

            if (updateResult) {
                res.json({ 
                    success: true, 
                    message: 'Payment successful and history updated.',
                    ticket: transactionDetails
                });
            } else {
                res.status(500).json({ success: false, message: 'Payment successful but failed to update history.' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Payment failed.' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// 获取用户交易历史的路由
route.get('/history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await fetch_history(userId);
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch history.' });
    }
});


export default route;