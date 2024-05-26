const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());//deberia parsear el resultado .>.

/**
app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
 */
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john12@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Dana',
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

app.get('/', (req, res) => {
    res.send(database.users)
});

app.post('/signin', (req, res) =>{
  bcrypt.compare("apple", '$2a$10$fsxBix38g5OjopGuidGv8O6dSVbu38rUV41frLOfMEwHalYRAchR2', function(err, res) {
    console.log('first guess', res);
  });
  bcrypt.compare("veggies", '$2a$10$fsxBix38g5OjopGuidGv8O6dSVbu38rUV41frLOfMEwHalYRAchR2', function(err, res) {
    console.log('second guess', res);
  });
    try {
      console.log('req.body', req.body);
      if(req.body.email === database.users[0].email && 
         req.body.password === database.users[0].password){
        res.json('success'); // Authentication successful
      }
    
        
      } catch (error) {
        console.error(error);
        res.status(400).json('Error log in'); // Generic error for client
      }
});

app.post('/register', (req, res) =>{
  const {email, name, password} = req.body; 
  //bcrypt.hash(password, null, null, function(err, hash) {
    //console.log(hash);
 // }); 
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


// Load hash from your password DB.
//bcrypt.compare("bacon", hash, function(err, res) {
  // res == true
//});
//bcrypt.compare("veggies", hash, function(err, res) {
  // res = false
//});
app.listen(4000, () => {
    console.log('app is running on port 4000');
});

