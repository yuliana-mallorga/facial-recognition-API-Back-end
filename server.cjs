const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const knex = require('knex');

const register = require('./controllers/register.cjs');
const { handleRegister } = require('./controllers/register.cjs');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1202',
    database: 'smart-brain'
  },
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors()); 

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })    
      } else {
        res.status(401).json('invalid user or credentials')
      }
    })
    .catch(err => res.status(401).json('invalid user or credentials'))
})

app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) =>{
  const { id } = req.params;
  db.select('*').from('users').where({id})
  .then(user => {
    if(user.length) {
      res.status(200).json(user[0]);
    } else {
      res.status(404).json('Not found');
    }
  })
  .catch(err =>{
    res.status(400).json('Error getting user');
  })
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then( entries => {
    res.status(200).json(Number(entries[0].entries));
  })
  .catch( err => res.status(400).json('Unable to get entries'))

});

app.listen(4000, () => {
    console.log('app is running on port 4000');
});

