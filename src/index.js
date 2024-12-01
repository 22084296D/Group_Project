//Yeung Chin To 22084296D, WANG Haoyu 22102084D 
import express from 'express';
import session from 'express-session';
import login from './login.js';
import mongostore from 'connect-mongo';
import client from './dbclient.js';
import paymentRoute from './payment.js';
import transactionHistoryRoute from './transaction_history.js';
import eventRoute from './event_management.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'eie4432_project', 
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: mongostore.create({
      client,
      dbName: 'parkingdb',
      collectionName: 'session',
    }),
  })
);

app.get('/', (req, res) => {
  if (req.session.logged) {
      res.redirect('/dashboard.html');
  } else {
      res.redirect('/index.html'); 
  }
});

app.use('/auth', login);
app.use('/payment', paymentRoute);
app.use('/transaction', transactionHistoryRoute);
app.use('/event', eventRoute);

app.use(
    '/', 
    express.static('static')
);

const PORT = 8080;
app.listen(PORT, () => {
  const dateTime = new Date().toLocaleString();
  console.log(dateTime);
  console.log(`Server started at http://127.0.0.1:${PORT}`);
});