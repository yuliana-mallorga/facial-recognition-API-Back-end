const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
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
      const user = database.users.find((user)=> user.email === req.body.body.email && user.password === req.body.body.password)
      if (user) {
        res.status(200).json({ success: true });
      } else {
        res.status(403).json({success: false})
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false }); // Generic error for client
  
    }
});

app.post('/register', (req, res) =>{

  const {email, name, password} = req.body; 

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) =>{
  const { id } = req.params;
  database.users.forEach(user =>{
    if(user.id === id){
      res.json(user)
    } else{
      res.status(404).json|('no such user')
    }
  })
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id ){ 
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if(!found) {
    res.status(400).json('nor found');
  }
});

app.listen(4000, () => {
    console.log('app is running on port 4000');
});

