const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const { handleRegister } = require('./controllers/register.cjs');
const { handleSignin } = require('./controllers/signin.cjs');
const { handleProfileGet } = require('./controllers/profile.cjs');
const { handleImage } = require('./controllers/image.cjs');
const { handleApiCall } = require('./controllers/image.cjs');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DB_HOST,
    port:5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB
  },
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); 

app.get('/', (req, res) => { res.send('It is working')});
app.get('/api', (req, res) => { res.json({ message: 'CORS configurado correctamente' })});
app.post('/signin', handleSignin(db, bcrypt));
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { handleApiCall(req, res) });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
