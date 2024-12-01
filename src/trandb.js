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

async function fetch_history(userId) {
    try {
        const history = client.db('parkingdb').collection('history');
        const result = await history.find({ userId: userId }).toArray();
        return result;
    } catch (err) {
      console.error('Unable to fetch from database!');
      return [];
    }
  }

export { init_historydb, update_history, fetch_history };
