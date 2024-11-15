const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const knex = require('knex');

const postgres = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1202',
    database: 'smart-brain'
  },
});

postgres.select('*').from('users');


const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            password: 'cookies',
            email: 'john12@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Dana',
            password: 'chess',
            email: 'dana1@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
      {
        id: '987',
        has: '',
        email: 'john12@gmail.com'
      }
    ]
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors()); 

app.get('/', (req, res) => {
    res.send(database.users)
});

app.post('/signin', (req, res) =>{
    try {
      console.log('AAAAAAAAAAAAAAAAAAAAAsignin', req.body);
      const {email, password} = req.body;
      const user = database.users.find((user)=> user.email === email && user.password === password)
      console.log('antes de if', user);
      if (user) {
        res.status(200).json(database.users[0]);
      } else {
        res.status(403).json({success: false})
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false }); // Generic error for client
    }
});

app.post('/register', (req, res) =>{
  console.log('YYYYYYYYYYregister', req.body);
  const { email, name, password } = req.body; 

  const lastUser = database.users.at(-1)
  const newUser = {
    id: (Number(lastUser.id) + 1).toString(),
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  }

  database.users.push(newUser)

  res.status(200).json(newUser)
})

app.get('/profile/:id', (req, res) =>{
  const { id } = req.params;
  const user = database.users.find((user) => user.id === id)
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404).json({user: null})
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.find(user => {
    if(user.id === id ){ 
      user.entries++
      return true
    }
  })
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404).json({user: null})
  }
});

app.listen(4000, () => {
    console.log('app is running on port 4000');
});

