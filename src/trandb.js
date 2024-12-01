import fs from 'fs/promises'; 
import client from './dbclient.js'; 

async function init_historydb() {
    try {
      const history = client.db('parkingdb').collection('history');
      const count = await history.countDocuments();
  
      if (count === 0) {
        const data = await fs.readFile('tran_history.json', 'utf-8');
        const transData = JSON.parse(data);
        const result = await history.insertMany(transData);
        console.log(`Added ${result.insertedCount} history`);
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


export { init_historydb, update_history, fetch_history };
