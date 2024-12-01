//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import fs from 'fs/promises'; 
import { ObjectId } from 'mongodb';
import client from './dbclient.js'; 

async function init_historydb() {
    try {
        const history = client.db('parkingdb').collection('history');
        const transcount = await history.countDocuments();

        if (transcount === 0) {
            const readtransdata = await fs.readFile('tran_history.json', 'utf-8');
            const transData = JSON.parse(readtransdata);
            const result = await history.insertMany(transData);
            console.log(`Initially added ${result.insertedCount} history`);
        }
    } catch (err) {
        console.error('Unable to initialize the database!', err);
    }
}
init_historydb().catch(console.dir);

async function update_history(transactionDetails) {
    try {
        const history = client.db('parkingdb').collection('history');
        const result = await history.insertOne({
            ...transactionDetails,
            timestamp: new Date()
        });

        if (result.insertedId) {
            console.log('Added 1 transaction record');
            return true;
        } else {
            console.log('Failed to add transaction record');
            return false;
        }
    } catch (err) {
        console.error('Error adding transaction record:', err);
        return false;
    }
}

async function fetch_history(userId, spaceId) {
    try {
        const history = client.db('parkingdb').collection('history');
        let query = {};
        if (userId) query.userId = userId;
        if (spaceId) query.spaceId = spaceId;
        const transactions = await history.find(query).toArray();

        return transactions.map(transaction => ({
            _id: transaction._id,  // 确保包含 _id 字段
            userId: transaction.userId,
            spaceId: transaction.spaceId,
            startTime: transaction.startTime,
            endTime: transaction.endTime,
            totalCost: transaction.totalCost || transaction.totalcost || 0,
            paymentMethod: transaction.paymentMethod,
            lastFourDigits: transaction.lastFourDigits,
            status: transaction.status || transaction.Status,
            timestamp: transaction.timestamp
        }));
    } catch (err) {
        console.error('Unable to fetch from database!', err);
        return [];
    }
}

async function delete_transaction(transactionId) {
    try {
        console.log('Deleting transaction with ID:', transactionId);
        const history = client.db('parkingdb').collection('history');
        const result = await history.deleteOne({ _id: new ObjectId(transactionId) });
        
        if (result.deletedCount === 1) {
            console.log('Successfully deleted one transaction');
            return true;
        } else {
            console.log('No transaction found with the given id');
            return false;
        }
    } catch (err) {
        console.error('Error deleting transaction:', err);
        return false;
    }
}

export { init_historydb, update_history, fetch_history, delete_transaction };
