//Yeung Chin To 22084296D, WANG Haoyu 22102084D
import express from 'express';
import session from 'express-session';
import login from './login.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'eie4432_project', 
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true } 
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

app.use(
    '/', 
    express.static('static')
);

const PORT = 8080;
app.listen(PORT, () => {
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
    console.log(`${currentDate}`);
    console.log(`Server started at http://127.0.0.1:${PORT}`);
});